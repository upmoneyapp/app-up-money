'use client'

import { useState } from 'react'
import { Plus, Minus, TrendingDown } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function QuadroCortesPage() {
  const [expenses, setExpenses] = useState<Array<{
    id: string
    description: string
    amount: number
    category: 'needs' | 'wants'
    date: string
  }>>([])
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'needs' as 'needs' | 'wants'
  })

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return

    const expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0]
    }

    setExpenses([...expenses, expense])
    setNewExpense({ description: '', amount: '', category: 'needs' })
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Quadro de Cortes</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Adicionar Despesa</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Descrição"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
            />
            <input
              type="number"
              placeholder="Valor"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as 'needs' | 'wants' })}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="needs">Necessidades</option>
              <option value="wants">Desejos</option>
            </select>
            <button
              onClick={addExpense}
              className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-4 py-2 rounded-lg font-semibold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Necessidades</h3>
            <div className="space-y-3">
              {expenses.filter(exp => exp.category === 'needs').map(expense => (
                <div key={expense.id} className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-slate-400">{expense.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">R$ {expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {expenses.filter(exp => exp.category === 'needs').length === 0 && (
                <p className="text-slate-400 text-center py-4">Nenhuma despesa cadastrada</p>
              )}
            </div>
          </div>

          <div className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Desejos</h3>
            <div className="space-y-3">
              {expenses.filter(exp => exp.category === 'wants').map(expense => (
                <div key={expense.id} className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-slate-400">{expense.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">R$ {expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {expenses.filter(exp => exp.category === 'wants').length === 0 && (
                <p className="text-slate-400 text-center py-4">Nenhuma despesa cadastrada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
