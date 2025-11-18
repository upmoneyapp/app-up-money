'use client'

import { useState } from 'react'
import { TrendingUp, Wallet, PieChart } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function PatrimonioPage() {
  const [assets, setAssets] = useState({
    savings: 0,
    investments: 0,
    realEstate: 0,
    vehicles: 0,
    others: 0
  })

  const [liabilities, setLiabilities] = useState({
    loans: 0,
    creditCards: 0,
    financing: 0,
    others: 0
  })

  const totalAssets = Object.values(assets).reduce((sum, val) => sum + val, 0)
  const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + val, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Patrimônio</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-bold">Ativos</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-8 h-8 text-red-400" />
              <h3 className="text-xl font-bold">Passivos</h3>
            </div>
            <p className="text-3xl font-bold text-red-400">
              R$ {totalLiabilities.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-2xl p-6 border border-[#dd9828]/30">
            <div className="flex items-center space-x-3 mb-4">
              <PieChart className="w-8 h-8 text-[#dd9828]" />
              <h3 className="text-xl font-bold">Patrimônio Líquido</h3>
            </div>
            <p className="text-3xl font-bold text-[#dd9828]">
              R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">Ativos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Poupança/Conta Corrente</label>
                <input
                  type="number"
                  value={assets.savings}
                  onChange={(e) => setAssets({ ...assets, savings: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Investimentos</label>
                <input
                  type="number"
                  value={assets.investments}
                  onChange={(e) => setAssets({ ...assets, investments: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Imóveis</label>
                <input
                  type="number"
                  value={assets.realEstate}
                  onChange={(e) => setAssets({ ...assets, realEstate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Veículos</label>
                <input
                  type="number"
                  value={assets.vehicles}
                  onChange={(e) => setAssets({ ...assets, vehicles: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Outros</label>
                <input
                  type="number"
                  value={assets.others}
                  onChange={(e) => setAssets({ ...assets, others: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-red-400">Passivos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Empréstimos</label>
                <input
                  type="number"
                  value={liabilities.loans}
                  onChange={(e) => setLiabilities({ ...liabilities, loans: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cartões de Crédito</label>
                <input
                  type="number"
                  value={liabilities.creditCards}
                  onChange={(e) => setLiabilities({ ...liabilities, creditCards: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Financiamentos</label>
                <input
                  type="number"
                  value={liabilities.financing}
                  onChange={(e) => setLiabilities({ ...liabilities, financing: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Outros</label>
                <input
                  type="number"
                  value={liabilities.others}
                  onChange={(e) => setLiabilities({ ...liabilities, others: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
