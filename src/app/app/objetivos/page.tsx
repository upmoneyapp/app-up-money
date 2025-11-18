'use client'

import { useState } from 'react'
import { Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function ObjetivosPage() {
  const [goals, setGoals] = useState<Array<{
    id: string
    name: string
    targetAmount: number
    currentAmount: number
    deadline: string
  }>>([])

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  })

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return

    const goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline
    }

    setGoals([...goals, goal])
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '' })
  }

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount: amount } : goal
    ))
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Objetivos Financeiros</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Adicionar Novo Objetivo</h3>
          <div className="grid md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Nome do objetivo"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
            />
            <input
              type="number"
              placeholder="Valor alvo"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
            />
            <input
              type="number"
              placeholder="Valor atual"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            />
            <button
              onClick={addGoal}
              className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-4 py-2 rounded-lg font-semibold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const isCompleted = progress >= 100
            
            return (
              <div key={goal.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{goal.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progresso</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-400' : 'bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Atual</p>
                      <p className="font-bold text-[#dd9828]">
                        R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Meta</p>
                      <p className="font-bold">
                        R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <label className="block text-sm font-medium mb-2">Atualizar progresso</label>
                    <input
                      type="number"
                      value={goal.currentAmount}
                      onChange={(e) => updateGoalProgress(goal.id, parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {goals.length === 0 && (
            <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
              <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum objetivo cadastrado ainda</p>
              <p className="text-sm text-slate-500 mt-2">Adicione seu primeiro objetivo financeiro acima</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
