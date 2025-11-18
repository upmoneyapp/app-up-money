'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, type User } from '@/lib/auth'
import AuthForm from '@/components/AuthForm'
import AppDashboard from '@/components/AppDashboard'
import { supabase } from '@/lib/supabase'

export default function AppPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    checkUser()
    
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setShowAuth(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setShowAuth(!currentUser)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      setShowAuth(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = async () => {
    await checkUser()
  }

  const handleLogout = () => {
    setUser(null)
    setShowAuth(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#040509] to-[#2b3747] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#dd9828] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (showAuth || !user) {
    return <AuthForm onSuccess={handleAuthSuccess} />
  }

  return <AppDashboard user={user} onLogout={handleLogout} />
}