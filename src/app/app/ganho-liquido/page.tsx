'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function GanhoLiquidoPage() {
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [investments, setInvestments] = useState(0)

  const netIncome = income - expenses - investments
  const savingsRate = income > 0 ? ((investments / income) * 100).toFixed(1) : 0

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Ganho Líquido</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4">Entradas e Saídas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Renda Total</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Despesas Totais</label>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Investimentos</label>
                <input
                  type="number"
                  value={investments}
                  onChange={(e) => setInvestments(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-2xl p-6 border border-[#dd9828]/30">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-8 h-8 text-[#dd9828]" />
                <h3 className="text-xl font-bold">Ganho Líquido</h3>
              </div>
              <p className="text-4xl font-bold text-[#dd9828]">
                R$ {netIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Valor disponível após despesas e investimentos
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h3 className="text-xl font-bold">Taxa de Poupança</h3>
              </div>
              <p className="text-4xl font-bold text-green-400">
                {savingsRate}%
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Percentual da renda destinado a investimentos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Resumo Mensal</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-slate-400 mb-1">Renda</p>
              <p className="text-xl font-bold text-blue-400">
                R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
              <p className="text-sm text-slate-400 mb-1">Despesas</p>
              <p className="text-xl font-bold text-red-400">
                R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
              <p className="text-sm text-slate-400 mb-1">Investimentos</p>
              <p className="text-xl font-bold text-purple-400">
                R$ {investments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-slate-400 mb-1">Líquido</p>
              <p className="text-xl font-bold text-green-400">
                R$ {netIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
