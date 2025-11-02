import { supabase } from '@/lib/supabase'
import { checkUserAccessByEmail } from '@/lib/access-control'

export interface User {
  id: string
  email: string
  name: string | null
  plan_type: 'monthly' | 'semester' | 'annual' | null
  plan_status: 'active' | 'inactive' | 'cancelled' | null
  plan_expires_at: string | null
  hotmart_transaction_id: string | null
  created_at: string
  updated_at: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return null
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (userError || !userData) {
      return null
    }

    return userData as User
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) {
      return null
    }

    return data as User
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error)
    return null
  }
}

export async function hasActiveSubscription(user: User): Promise<boolean> {
  if (!user.plan_status || user.plan_status !== 'active') {
    return false
  }

  if (!user.plan_expires_at) {
    return false
  }

  const expirationDate = new Date(user.plan_expires_at)
  const now = new Date()

  return expirationDate > now
}

/**
 * Verifica se um usuário tem acesso baseado apenas no email
 * Usado para verificar pagamentos da Hotmart sem necessidade de autenticação
 */
export async function checkUserAccessByEmailOnly(email: string): Promise<{ hasAccess: boolean; user: User | null }> {
  try {
    const accessStatus = await checkUserAccessByEmail(email)
    return {
      hasAccess: accessStatus.hasAccess,
      user: accessStatus.user as User | null
    }
  } catch (error) {
    console.error('Erro ao verificar acesso por email:', error)
    return { hasAccess: false, user: null }
  }
}

/**
 * Cria uma sessão temporária para usuário com pagamento confirmado
 * Permite acesso ao app sem necessidade de cadastro tradicional
 */
export async function createTemporarySession(email: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Verificar se o usuário tem acesso via pagamento
    const { hasAccess, user } = await checkUserAccessByEmailOnly(email)
    
    if (!hasAccess || !user) {
      return { success: false, error: 'Usuário não tem acesso ativo' }
    }

    // Criar sessão temporária no Supabase Auth (se necessário)
    // Por enquanto, apenas retornamos o usuário para uso direto
    return { success: true, user }
  } catch (error) {
    console.error('Erro ao criar sessão temporária:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

export async function getPlanInfo(planType: string) {
  const planConfigs = {
    monthly: {
      name: 'Plano Mensal',
      duration: '30 dias',
      price: 'R$ 47,90',
      features: [
        'Acesso completo ao app UP Money',
        'Método 60/30/10',
        'Calculadora de juros compostos',
        'Controle de orçamento',
        'Suporte via email'
      ]
    },
    semester: {
      name: 'Plano Semestral',
      duration: '6 meses',
      price: '6x de R$ 18,37',
      features: [
        'Acesso completo ao app UP Money',
        'Método 60/30/10',
        'Calculadora de juros compostos',
        'Controle de orçamento',
        'Suporte prioritário',
        'Ebooks bônus inclusos'
      ]
    },
    annual: {
      name: 'Plano Anual',
      duration: '12 meses',
      price: '12x de R$ 15,30',
      features: [
        'Acesso completo ao app UP Money',
        'Método 60/30/10',
        'Calculadora de juros compostos',
        'Controle de orçamento',
        'Suporte VIP',
        'Ebooks bônus inclusos',
        'Consultoria financeira mensal'
      ]
    }
  }

  return planConfigs[planType as keyof typeof planConfigs] || null
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  return { data, error }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}