'use client'

import { useState } from 'react'
import { DollarSign, Target, Wallet, TrendingUp, Plus, Minus } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function OrcamentoPage() {
  const [budget, setBudget] = useState({
    income: 0,
    needs: 0, // 60%
    wants: 0, // 30%
    savings: 0 // 10%
  })

  const handleIncomeChange = (income: number) => {
    setBudget({
      income,
      needs: income * 0.6,
      wants: income * 0.3,
      savings: income * 0.1
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orçamento</h1>
        
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
      </div>
    </AppLayout>
  )
}
