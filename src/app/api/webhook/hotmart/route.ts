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
    const webhookData = JSON.parse(body)
    
    console.log('Webhook recebido da Hotmart:', webhookData)

    // Extrair dados do webhook da Hotmart
    const {
      event,
      data: {
        purchase: {
          transaction,
          buyer_email,
          buyer_name,
          product,
          price,
          status
        } = {}
      } = {}
    } = webhookData

    // Verificar se é um evento de compra aprovada
    if (event !== 'PURCHASE_APPROVED' && event !== 'PURCHASE_COMPLETE') {
      return NextResponse.json({ 
        success: false, 
        message: 'Evento não processado' 
      }, { status: 200 })
    }

    // Determinar tipo de plano baseado no produto ou preço
    let planType: 'monthly' | 'semester' | 'annual' = 'monthly'
    
    // Lógica para determinar o plano baseado no preço ou ID do produto
    if (price) {
      const priceValue = parseFloat(price.value || price)
      if (priceValue >= 140 && priceValue <= 160) {
        planType = 'annual'
      } else if (priceValue >= 90 && priceValue <= 110) {
        planType = 'semester'
      } else {
        planType = 'monthly'
      }
    }

    // Calcular data de expiração
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + PLAN_CONFIGS[planType].duration)

    // Verificar se usuário já existe
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', buyer_email)
      .single()

    let userId: string

    if (existingUser) {
      // Atualizar usuário existente
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: buyer_name,
          plan_type: planType,
          plan_status: 'active',
          plan_expires_at: expirationDate.toISOString(),
          hotmart_transaction_id: transaction,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError)
        throw updateError
      }

      userId = existingUser.id
    } else {
      // Criar novo usuário
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: buyer_email,
          name: buyer_name,
          plan_type: planType,
          plan_status: 'active',
          plan_expires_at: expirationDate.toISOString(),
          hotmart_transaction_id: transaction
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
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        hotmart_transaction_id: transaction,
        product_id: product?.id || 'unknown',
        plan_type: planType,
        amount: parseFloat(price?.value || price || '0'),
        status: 'completed',
        webhook_data: webhookData
      })

    if (transactionError) {
      console.error('Erro ao registrar transação:', transactionError)
      // Não falha o processo, apenas loga o erro
    }

    console.log(`✅ Acesso liberado para ${buyer_email} - Plano: ${planType}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processado com sucesso',
      user_id: userId,
      plan_type: planType,
      expires_at: expirationDate.toISOString()
    })

  } catch (error) {
    console.error('Erro no webhook da Hotmart:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Método GET para teste
export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint do webhook da Hotmart está funcionando',
    timestamp: new Date().toISOString()
  })
}