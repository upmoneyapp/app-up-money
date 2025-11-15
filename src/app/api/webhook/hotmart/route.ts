import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Criar cliente Supabase com service role para operações administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log do webhook recebido
    console.log('Webhook Hotmart recebido:', JSON.stringify(body, null, 2));

    // Verificar se é uma compra aprovada
    const event = body.event;
    const data = body.data;

    if (event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE') {
      const buyerEmail = data.buyer?.email;
      const buyerName = data.buyer?.name;
      const productName = data.product?.name;
      const transactionId = data.purchase?.transaction;
      const status = data.purchase?.status;

      if (!buyerEmail) {
        return NextResponse.json(
          { error: 'Email do comprador não encontrado' },
          { status: 400 }
        );
      }

      // Verificar se o usuário já existe no Supabase Auth
      const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.listUsers();
      
      let userId: string;
      const userExists = existingUser?.users?.find(u => u.email === buyerEmail);

      if (userExists) {
        userId = userExists.id;
        console.log('Usuário já existe:', buyerEmail);
      } else {
        // Criar novo usuário no Supabase Auth
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: buyerEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            name: buyerName,
            created_via: 'hotmart_webhook'
          }
        });

        if (createError || !newUser.user) {
          console.error('Erro ao criar usuário:', createError);
          return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
          );
        }

        userId = newUser.user.id;
        console.log('Novo usuário criado:', buyerEmail);

        // Enviar email com instruções de acesso
        // TODO: Implementar envio de email com credenciais
      }

      // Registrar a compra na tabela de purchases
      const { error: purchaseError } = await supabaseAdmin
        .from('purchases')
        .upsert({
          user_id: userId,
          email: buyerEmail,
          transaction_id: transactionId,
          product_name: productName,
          status: status,
          purchase_data: data,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'transaction_id'
        });

      if (purchaseError) {
        console.error('Erro ao registrar compra:', purchaseError);
      }

      // Criar registro inicial de user_data se não existir
      const { error: userDataError } = await supabaseAdmin
        .from('user_data')
        .upsert({
          user_id: userId,
          monthly_income: 0,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (userDataError) {
        console.error('Erro ao criar user_data:', userDataError);
      }

      return NextResponse.json({
        success: true,
        message: 'Compra processada com sucesso',
        user_id: userId,
        email: buyerEmail
      });
    }

    // Outros eventos (cancelamento, reembolso, etc.)
    return NextResponse.json({
      success: true,
      message: 'Evento recebido mas não processado',
      event: event
    });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar webhook' },
      { status: 500 }
    );
  }
}

// Permitir GET para teste
export async function GET() {
  return NextResponse.json({
    message: 'Webhook Hotmart - UP Money',
    status: 'active'
  });
}
