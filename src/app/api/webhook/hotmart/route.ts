import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

// Configurações dos planos
const PLAN_CONFIGS = {
  monthly: {
    duration: 30, // dias
    name: 'Plano Mensal'
  },
  semester: {
    duration: 180, // dias
    name: 'Plano Semestral'
  },
  annual: {
    duration: 365, // dias
    name: 'Plano Anual'
  }
}

// Função para validar webhook da Hotmart (opcional - se você tiver token)
function validateHotmartWebhook(payload: string, signature: string, token: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', token)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Erro na validação do webhook:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log('Raw webhook body:', body)
    
    let webhookData
    try {
      webhookData = JSON.parse(body)
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError)
      return NextResponse.json({ 
        success: false, 
        message: 'JSON inválido' 
      }, { status: 400 })
    }
    
    console.log('Webhook recebido da Hotmart:', JSON.stringify(webhookData, null, 2))

    // Extrair dados do webhook da Hotmart - estrutura corrigida
    const event = webhookData.event || webhookData.type
    const data = webhookData.data || webhookData
    
    // Verificar se é um evento de compra aprovada ou completa
    if (event !== 'PURCHASE_APPROVED' && event !== 'PURCHASE_COMPLETE') {
      console.log(`Evento ${event} não processado`)
      return NextResponse.json({ 
        success: true, 
        message: `Evento ${event} recebido mas não processado` 
      }, { status: 200 })
    }

    // Extrair dados da compra com fallbacks seguros
    const purchase = data.purchase || data
    const buyer = purchase.buyer || {}
    const product = purchase.product || {}
    const price = purchase.price || purchase.offer_price || {}
    
    const buyerEmail = buyer.email || purchase.buyer_email || ''
    const buyerName = buyer.name || purchase.buyer_name || 'Cliente'
    const transactionId = purchase.transaction || purchase.transaction_id || `tx_${Date.now()}`
    const productId = product.id || purchase.product_id || 'unknown'
    
    // Validar dados obrigatórios
    if (!buyerEmail) {
      console.error('Email do comprador não encontrado no webhook')
      return NextResponse.json({ 
        success: false, 
        message: 'Email do comprador é obrigatório' 
      }, { status: 400 })
    }

    // Determinar tipo de plano baseado no produto ou preço
    let planType: 'monthly' | 'semester' | 'annual' = 'monthly'
    
    // Lógica para determinar o plano baseado no preço
    const priceValue = parseFloat(price.value || price.amount || price || '0')
    console.log('Valor do preço detectado:', priceValue)
    
    if (priceValue >= 140) {
      planType = 'annual'
    } else if (priceValue >= 90) {
      planType = 'semester'
    } else {
      planType = 'monthly'
    }

    console.log(`Plano determinado: ${planType} (baseado no preço: ${priceValue})`)

    // Calcular data de expiração
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + PLAN_CONFIGS[planType].duration)

    // Verificar se usuário já existe
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', buyerEmail)
      .maybeSingle() // Use maybeSingle() em vez de single() para evitar erro quando não encontrar

    if (userError && userError.code !== 'PGRST116') {
      console.error('Erro ao buscar usuário:', userError)
      throw userError
    }

    let userId: string

    if (existingUser) {
      console.log('Atualizando usuário existente:', buyerEmail)
      // Atualizar usuário existente
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: buyerName,
          plan_type: planType,
          plan_status: 'active',
          plan_expires_at: expirationDate.toISOString(),
          hotmart_transaction_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError)
        throw updateError
      }

      userId = existingUser.id
    } else {
      console.log('Criando novo usuário:', buyerEmail)
      // Criar novo usuário
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: buyerEmail,
          name: buyerName,
          plan_type: planType,
          plan_status: 'active',
          plan_expires_at: expirationDate.toISOString(),
          hotmart_transaction_id: transactionId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Erro ao criar usuário:', createError)
        throw createError
      }

      userId = newUser.id
    }

    // Registrar transação
    try {
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          hotmart_transaction_id: transactionId,
          product_id: productId,
          plan_type: planType,
          amount: priceValue,
          status: 'completed',
          webhook_data: webhookData,
          created_at: new Date().toISOString()
        })

      if (transactionError) {
        console.error('Erro ao registrar transação:', transactionError)
        // Não falha o processo, apenas loga o erro
      }
    } catch (transactionErr) {
      console.error('Erro ao inserir transação:', transactionErr)
      // Continua o processo mesmo se a transação falhar
    }

    console.log(`✅ Acesso liberado para ${buyerEmail} - Plano: ${planType} - Expira em: ${expirationDate.toISOString()}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processado com sucesso',
      user_id: userId,
      plan_type: planType,
      expires_at: expirationDate.toISOString(),
      event: event
    })

  } catch (error) {
    console.error('Erro no webhook da Hotmart:', error)
    
    // Log detalhado do erro para debug
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Método GET para teste
export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint do webhook da Hotmart está funcionando',
    timestamp: new Date().toISOString(),
    events_supported: ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']
  })
}