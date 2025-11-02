import { supabase } from '@/lib/supabase'

export interface AccessStatus {
  hasAccess: boolean
  user: any | null
  reason?: string
}

/**
 * Verifica se um usuário tem acesso baseado no email
 * Usado para verificar pagamentos via Hotmart
 */
export async function checkUserAccessByEmail(email: string): Promise<AccessStatus> {
  try {
    if (!email) {
      return { hasAccess: false, user: null, reason: 'Email não fornecido' }
    }

    // Buscar usuário no banco
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar usuário:', error)
      return { hasAccess: false, user: null, reason: 'Erro na consulta' }
    }

    if (!user) {
      return { hasAccess: false, user: null, reason: 'Usuário não encontrado' }
    }

    // Verificar se tem plano ativo
    if (!user.plan_status || user.plan_status !== 'active') {
      return { hasAccess: false, user, reason: 'Plano inativo' }
    }

    // Verificar se o plano não expirou
    if (user.plan_expires_at) {
      const expirationDate = new Date(user.plan_expires_at)
      const now = new Date()

      if (expirationDate <= now) {
        // Atualizar status para expirado
        await supabase
          .from('users')
          .update({ plan_status: 'inactive' })
          .eq('id', user.id)

        return { hasAccess: false, user, reason: 'Plano expirado' }
      }
    }

    return { hasAccess: true, user, reason: 'Acesso liberado' }
  } catch (error) {
    console.error('Erro na verificação de acesso:', error)
    return { hasAccess: false, user: null, reason: 'Erro interno' }
  }
}

/**
 * Verifica se um usuário tem acesso baseado no transaction ID da Hotmart
 * Usado como fallback quando não há email
 */
export async function checkUserAccessByTransaction(transactionId: string): Promise<AccessStatus> {
  try {
    if (!transactionId) {
      return { hasAccess: false, user: null, reason: 'Transaction ID não fornecido' }
    }

    // Buscar usuário pelo transaction ID
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('hotmart_transaction_id', transactionId)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar usuário por transaction:', error)
      return { hasAccess: false, user: null, reason: 'Erro na consulta' }
    }

    if (!user) {
      return { hasAccess: false, user: null, reason: 'Transação não encontrada' }
    }

    // Verificar se tem plano ativo
    if (!user.plan_status || user.plan_status !== 'active') {
      return { hasAccess: false, user, reason: 'Plano inativo' }
    }

    // Verificar se o plano não expirou
    if (user.plan_expires_at) {
      const expirationDate = new Date(user.plan_expires_at)
      const now = new Date()

      if (expirationDate <= now) {
        // Atualizar status para expirado
        await supabase
          .from('users')
          .update({ plan_status: 'inactive' })
          .eq('id', user.id)

        return { hasAccess: false, user, reason: 'Plano expirado' }
      }
    }

    return { hasAccess: true, user, reason: 'Acesso liberado' }
  } catch (error) {
    console.error('Erro na verificação de acesso por transação:', error)
    return { hasAccess: false, user: null, reason: 'Erro interno' }
  }
}

/**
 * Libera acesso para um usuário após pagamento confirmado
 */
export async function grantUserAccess(
  email: string, 
  name: string, 
  planType: 'monthly' | 'semester' | 'annual',
  transactionId: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const planDurations = {
      monthly: 30,
      semester: 180,
      annual: 365
    }

    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + planDurations[planType])

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    let user

    if (existingUser) {
      // Atualizar usuário existente
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          name,
          plan_type: planType,
          plan_status: 'active',
          plan_expires_at: expirationDate.toISOString(),
          hotmart_transaction_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single()

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      user = updatedUser
    } else {
      // Criar novo usuário
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase().trim(),
          name,
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
        return { success: false, error: createError.message }
      }

      user = newUser
    }

    return { success: true, user }
  } catch (error) {
    console.error('Erro ao liberar acesso:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

/**
 * Verifica status de múltiplos usuários (para admin)
 */
export async function checkMultipleUsersAccess(emails: string[]): Promise<AccessStatus[]> {
  const results: AccessStatus[] = []
  
  for (const email of emails) {
    const status = await checkUserAccessByEmail(email)
    results.push(status)
  }
  
  return results
}

/**
 * Revoga acesso de um usuário
 */
export async function revokeUserAccess(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        plan_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase().trim())

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro ao revogar acesso:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}