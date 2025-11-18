'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, Target, Wallet, TrendingUp, PieChart, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import AppLayout from '@/components/AppLayout'

export default function AppPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [budget, setBudget] = useState({
    income: 0,
    needs: 0,
    wants: 0,
    savings: 0
  })

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/')
        return
      }

      // Verificar se usuário está ativo
      const { data: user } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (!user?.is_active) {
        router.push('/')
        return
      }

      setUserData(user)
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleIncomeChange = (income: number) => {
    setBudget({
      income,
      needs: income * 0.6,
      wants: income * 0.3,
      savings: income * 0.1
    })
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Painel de Controle</h1>
          <Award className="w-8 h-8 text-[#dd9828]" />
        </div>

        {/* Status do Plano */}
        <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-2xl p-6 border border-[#dd9828]/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Plano Ativo</h3>
              <p className="text-slate-300">
                Você tem acesso completo a todas as funcionalidades do UP Money
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Status</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-green-400 font-semibold">Ativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visão Geral Financeira */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-2xl p-6 border border-[#dd9828]/30">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="w-8 h-8 text-[#dd9828]" />
              <h3 className="text-xl font-bold">Renda Mensal</h3>
            </div>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Digite sua renda"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
                onChange={(e) => handleIncomeChange(parseFloat(e.target.value) || 0)}
              />
              <p className="text-2xl font-bold text-[#dd9828]">
                R$ {budget.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold">Necessidades (60%)</h3>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              R$ {budget.needs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold">Desejos (30%)</h3>
            </div>
            <p className="text-2xl font-bold text-purple-400">
              R$ {budget.wants.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold">Eu do Futuro (10%)</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">
            R$ {budget.savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-400 mt-2">
            Este valor deve ser poupado automaticamente todo mês
          </p>
        </div>

        {/* Atalhos Rápidos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Acesso Rápido</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/app/orcamento')}
              className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors text-left"
            >
              <CreditCard className="w-6 h-6 text-[#dd9828] mb-2" />
              <p className="font-semibold">Orçamento</p>
            </button>
            <button
              onClick={() => router.push('/app/objetivos')}
              className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors text-left"
            >
              <Target className="w-6 h-6 text-[#dd9828] mb-2" />
              <p className="font-semibold">Objetivos</p>
            </button>
            <button
              onClick={() => router.push('/app/simulador-juros')}
              className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors text-left"
            >
              <TrendingUp className="w-6 h-6 text-[#dd9828] mb-2" />
              <p className="font-semibold">Simulador</p>
            </button>
            <button
              onClick={() => router.push('/app/patrimonio')}
              className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors text-left"
            >
              <PieChart className="w-6 h-6 text-[#dd9828] mb-2" />
              <p className="font-semibold">Patrimônio</p>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
