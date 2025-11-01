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
      }, { status: 200 }) // Mudança: retorna 200 em vez de 400
    }
    
    console.log('Webhook recebido da Hotmart:', JSON.stringify(webhookData, null, 2))

    // Extrair dados do webhook da Hotmart - estrutura mais flexível
    const event = webhookData.event || webhookData.type || webhookData.status || 'PURCHASE_APPROVED'
    const data = webhookData.data || webhookData
    
    console.log('Evento detectado:', event)

    // Processar todos os eventos relacionados a compra (mais flexível)
    const validEvents = [
      'PURCHASE_APPROVED', 
      'PURCHASE_COMPLETE', 
      'PURCHASE_BILLED',
      'PURCHASE_PAID',
      'approved',
      'completed',
      'billed'
    ]
    
    const eventLower = event.toLowerCase()
    const isValidEvent = validEvents.some(validEvent => 
      eventLower.includes(validEvent.toLowerCase()) || 
      validEvent.toLowerCase().includes(eventLower)
    )

    if (!isValidEvent) {
      console.log(`Evento ${event} recebido - processando mesmo assim`)
      // Continua processando em vez de rejeitar
    }

    // Extrair dados da compra com múltiplos fallbacks
    const purchase = data.purchase || data.transaction || data
    const buyer = purchase.buyer || purchase.customer || purchase.user || {}
    const product = purchase.product || purchase.offer || {}
    const price = purchase.price || purchase.offer_price || purchase.amount || purchase.value || {}
    
    // Múltiplos fallbacks para email
    const buyerEmail = buyer.email || 
                      purchase.buyer_email || 
                      purchase.customer_email ||
                      purchase.email ||
                      data.email ||
                      webhookData.email ||
                      ''
    
    // Múltiplos fallbacks para nome
    const buyerName = buyer.name || 
                     buyer.full_name ||
                     purchase.buyer_name || 
                     purchase.customer_name ||
                     purchase.name ||
                     data.name ||
                     webhookData.name ||
                     'Cliente'
    
    // Múltiplos fallbacks para transaction ID
    const transactionId = purchase.transaction || 
                         purchase.transaction_id || 
                         purchase.id ||
                         data.transaction ||
                         data.transaction_id ||
                         data.id ||
                         webhookData.transaction ||
                         webhookData.id ||
                         `tx_${Date.now()}`
    
    // Múltiplos fallbacks para product ID
    const productId = product.id || 
                     product.product_id ||
                     purchase.product_id || 
                     data.product_id ||
                     webhookData.product_id ||
                     'unknown'
    
    console.log('Dados extraídos:', {
      buyerEmail,
      buyerName,
      transactionId,
      productId
    })

    // Validação mais flexível - aceita mesmo sem email em alguns casos
    if (!buyerEmail && !transactionId) {
      console.error('Nem email nem transaction ID encontrados no webhook')
      // Retorna 200 para não causar reenvio do webhook
      return NextResponse.json({ 
        success: false, 
        message: 'Dados insuficientes para processar' 
      }, { status: 200 })
    }

    // Se não tem email, usa transaction ID como identificador
    const userIdentifier = buyerEmail || `tx_${transactionId}`

    // Determinar tipo de plano baseado no produto ou preço
    let planType: 'monthly' | 'semester' | 'annual' = 'monthly'
    
    // Múltiplos fallbacks para preço
    const priceValue = parseFloat(
      price.value || 
      price.amount || 
      price.total ||
      price ||
      purchase.price ||
      purchase.amount ||
      purchase.value ||
      data.price ||
      data.amount ||
      data.value ||
      '0'
    )
    
    console.log('Valor do preço detectado:', priceValue)
    
    // Lógica para determinar o plano baseado no preço
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

    let userId: string

    try {
      // Verificar se usuário já existe (apenas se tiver email)
      if (buyerEmail) {
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', buyerEmail)
          .maybeSingle()

        if (userError && userError.code !== 'PGRST116') {
          console.error('Erro ao buscar usuário:', userError)
          // Continua mesmo com erro de consulta
        }

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
            // Continua mesmo com erro
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
            // Continua mesmo com erro
            userId = `temp_${transactionId}`
          } else {
            userId = newUser.id
          }
        }
      } else {
        // Se não tem email, usa transaction ID como user ID temporário
        userId = `temp_${transactionId}`
        console.log('Processando sem email, usando ID temporário:', userId)
      }

      // Registrar transação (sempre tenta registrar)
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

      console.log(`✅ Webhook processado para ${userIdentifier} - Plano: ${planType} - Expira em: ${expirationDate.toISOString()}`)

      // SEMPRE retorna 200 para evitar reenvios
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook processado com sucesso',
        user_id: userId,
        plan_type: planType,
        expires_at: expirationDate.toISOString(),
        event: event,
        transaction_id: transactionId
      }, { status: 200 })

    } catch (dbError) {
      console.error('Erro de banco de dados:', dbError)
      
      // Mesmo com erro de BD, retorna 200 para não causar reenvio
      return NextResponse.json({ 
        success: false, 
        message: 'Erro de banco de dados, mas webhook recebido',
        error: dbError instanceof Error ? dbError.message : 'Erro desconhecido',
        transaction_id: transactionId,
        timestamp: new Date().toISOString()
      }, { status: 200 })
    }

  } catch (error) {
    console.error('Erro no webhook da Hotmart:', error)
    
    // Log detalhado do erro para debug
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    
    // SEMPRE retorna 200 para evitar reenvios infinitos
    return NextResponse.json({ 
      success: false, 
      message: 'Erro processado, webhook recebido',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 200 })
  }
}

// Método GET para teste
export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint do webhook da Hotmart está funcionando',
    timestamp: new Date().toISOString(),
    events_supported: ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'PURCHASE_BILLED', 'PURCHASE_PAID'],
    status: 'active'
  })
}