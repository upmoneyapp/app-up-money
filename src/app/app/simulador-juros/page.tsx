'use client'

import { useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function SimuladorJurosPage() {
  const [initialAmount, setInitialAmount] = useState(0)
  const [monthlyContribution, setMonthlyContribution] = useState(0)
  const [interestRate, setInterestRate] = useState(0)
  const [years, setYears] = useState(0)

  const calculateCompoundInterest = () => {
    const months = years * 12
    const monthlyRate = interestRate / 100 / 12
    
    let futureValue = initialAmount
    let totalInvested = initialAmount
    
    for (let i = 0; i < months; i++) {
      futureValue = futureValue * (1 + monthlyRate) + monthlyContribution
      totalInvested += monthlyContribution
    }
    
    const interestEarned = futureValue - totalInvested
    
    return {
      futureValue,
      totalInvested,
      interestEarned
    }
  }

  const result = calculateCompoundInterest()

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Simulador de Juros Compostos</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Calculator className="w-6 h-6" />
              <span>Dados da Simulação</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Valor inicial (R$)</label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Aporte mensal (R$)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Taxa de juros (% ao ano)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
                  placeholder="12"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Período (anos)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-2xl p-6 border border-[#dd9828]/30">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-8 h-8 text-[#dd9828]" />
                <h3 className="text-xl font-bold">Resultado</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Valor final</p>
                  <p className="text-3xl font-bold text-[#dd9828]">
                    R$ {result.futureValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-slate-400">Total investido</p>
                  <p className="text-xl font-semibold">
                    R$ {result.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Juros ganhos</p>
                  <p className="text-xl font-semibold text-green-400">
                    R$ {result.interestEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="font-bold mb-3">Resumo</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Período total:</span>
                  <span className="font-semibold">{years} anos ({years * 12} meses)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxa mensal:</span>
                  <span className="font-semibold">{(interestRate / 12).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rentabilidade:</span>
                  <span className="font-semibold text-green-400">
                    {result.totalInvested > 0 
                      ? ((result.interestEarned / result.totalInvested) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold mb-3 text-blue-400">💡 Dica</h3>
          <p className="text-slate-300">
            Os juros compostos são uma das ferramentas mais poderosas para construir riqueza a longo prazo. 
            Quanto mais cedo você começar a investir, maior será o efeito dos juros compostos sobre seu patrimônio. 
            Mesmo pequenos aportes mensais podem se transformar em grandes valores ao longo dos anos.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
