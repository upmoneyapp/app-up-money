import { NextRequest, NextResponse } from 'next/server';

// Interface para os dados do webhook da Hotmart
interface HotmartWebhookData {
  id: string;
  event: string;
  creation_date: string;
  data: {
    product: {
      id: number;
      name: string;
    };
    buyer: {
      name: string;
      email: string;
    };
    purchase: {
      order_date: string;
      price: {
        value: number;
        currency_value: string;
      };
      payment: {
        method: string;
        installments_number: number;
      };
      status: string;
    };
    subscription?: {
      id: string;
      status: string;
    };
    commissions?: Array<{
      value: number;
      source: string;
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma requisição válida da Hotmart
    const hotmartToken = request.headers.get('x-hotmart-hottok');
    
    if (!hotmartToken) {
      return NextResponse.json(
        { error: 'Token de verificação da Hotmart não encontrado' },
        { status: 401 }
      );
    }

    // Obter dados do webhook
    const webhookData: HotmartWebhookData = await request.json();
    
    console.log('📧 Webhook da Hotmart recebido:', {
      event: webhookData.event,
      produto: webhookData.data.product.name,
      comprador: webhookData.data.buyer.name,
      valor: webhookData.data.purchase.price.value,
      status: webhookData.data.purchase.status,
      data: webhookData.creation_date
    });

    // Processar diferentes tipos de eventos
    switch (webhookData.event) {
      case 'PURCHASE_COMPLETE':
        await handlePurchaseComplete(webhookData);
        break;
      
      case 'PURCHASE_CANCELED':
        await handlePurchaseCanceled(webhookData);
        break;
      
      case 'PURCHASE_REFUNDED':
        await handlePurchaseRefunded(webhookData);
        break;
      
      case 'SUBSCRIPTION_CANCELLATION':
        await handleSubscriptionCancellation(webhookData);
        break;
      
      default:
        console.log(`⚠️ Evento não processado: ${webhookData.event}`);
    }

    // Resposta de sucesso para a Hotmart
    return NextResponse.json({ 
      status: 'success',
      message: 'Webhook processado com sucesso',
      event: webhookData.event 
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook da Hotmart:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para processar compra completa
async function handlePurchaseComplete(data: HotmartWebhookData) {
  console.log('✅ Compra realizada com sucesso!');
  console.log(`Cliente: ${data.data.buyer.name} (${data.data.buyer.email})`);
  console.log(`Produto: ${data.data.product.name}`);
  console.log(`Valor: R$ ${data.data.purchase.price.value}`);
  
  // Aqui você pode:
  // - Salvar no banco de dados
  // - Enviar email de boas-vindas
  // - Ativar acesso do usuário
  // - Integrar com sistema de CRM
  
  // Exemplo de integração futura:
  // await saveToDatabase({
  //   customerName: data.data.buyer.name,
  //   customerEmail: data.data.buyer.email,
  //   productName: data.data.product.name,
  //   amount: data.data.purchase.price.value,
  //   status: 'completed',
  //   purchaseDate: data.data.purchase.order_date
  // });
}

// Função para processar cancelamento de compra
async function handlePurchaseCanceled(data: HotmartWebhookData) {
  console.log('❌ Compra cancelada');
  console.log(`Cliente: ${data.data.buyer.name}`);
  console.log(`Produto: ${data.data.product.name}`);
  
  // Aqui você pode:
  // - Atualizar status no banco
  // - Revogar acesso do usuário
  // - Enviar email de cancelamento
}

// Função para processar reembolso
async function handlePurchaseRefunded(data: HotmartWebhookData) {
  console.log('💰 Reembolso processado');
  console.log(`Cliente: ${data.data.buyer.name}`);
  console.log(`Valor reembolsado: R$ ${data.data.purchase.price.value}`);
  
  // Aqui você pode:
  // - Atualizar status no banco
  // - Revogar acesso do usuário
  // - Processar reembolso interno
}

// Função para processar cancelamento de assinatura
async function handleSubscriptionCancellation(data: HotmartWebhookData) {
  console.log('🔄 Assinatura cancelada');
  console.log(`Cliente: ${data.data.buyer.name}`);
  
  if (data.data.subscription) {
    console.log(`ID da Assinatura: ${data.data.subscription.id}`);
  }
  
  // Aqui você pode:
  // - Atualizar status da assinatura
  // - Manter acesso até o fim do período pago
  // - Enviar email de cancelamento
}

// Endpoint GET para verificar se a API está funcionando
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Webhook da Hotmart está funcionando!',
    timestamp: new Date().toISOString(),
    endpoint: '/api/hotmart/webhook'
  });
}