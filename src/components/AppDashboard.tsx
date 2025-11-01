'use client'

import { useState, useEffect } from 'react'
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  PieChart, 
  Calendar, 
  DollarSign,
  User,
  Settings,
  LogOut,
  CreditCard,
  BookOpen,
  BarChart3,
  Wallet,
  TrendingDown,
  Plus,
  Minus,
  Save,
  Download,
  Upload,
  Bell,
  Shield,
  Award,
  CheckCircle
} from 'lucide-react'
import { getCurrentUser, hasActiveSubscription, signOut, type User } from '@/lib/auth'

interface AppDashboardProps {
  user: User
  onLogout: () => void
}

export default function AppDashboard({ user, onLogout }: AppDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [budget, setBudget] = useState({
    income: 0,
    needs: 0, // 60%
    wants: 0, // 30%
    savings: 0 // 10%
  })
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
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    checkAccess()
  }, [user])

  const checkAccess = async () => {
    const access = await hasActiveSubscription(user)
    setHasAccess(access)
  }

  const handleIncomeChange = (income: number) => {
    setBudget({
      income,
      needs: income * 0.6,
      wants: income * 0.3,
      savings: income * 0.1
    })
  }

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

  const totalNeeds = expenses.filter(exp => exp.category === 'needs').reduce((sum, exp) => sum + exp.amount, 0)
  const totalWants = expenses.filter(exp => exp.category === 'wants').reduce((sum, exp) => sum + exp.amount, 0)
  const remainingNeeds = budget.needs - totalNeeds
  const remainingWants = budget.wants - totalWants
  const totalSaved = budget.savings

  const handleLogout = async () => {
    await signOut()
    onLogout()
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#040509] to-[#2b3747] text-white flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-[#dd9828] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-slate-300 mb-6">
            Seu plano expirou ou não está ativo. Para continuar usando o UP Money, 
            renove sua assinatura.
          </p>
          <div className="space-y-4">
            <div className="bg-[#2b3747]/50 rounded-lg p-4">
              <p className="text-sm text-slate-400">Plano atual:</p>
              <p className="font-semibold">{user.plan_type || 'Nenhum'}</p>
              <p className="text-sm text-slate-400">Status:</p>
              <p className="font-semibold">{user.plan_status || 'Inativo'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] py-3 rounded-lg font-semibold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300"
            >
              Voltar à página inicial
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
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
          <p className="text-sm text-slate-400 mt-2">
            Restante: R$ {remainingNeeds.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          <p className="text-sm text-slate-400 mt-2">
            Restante: R$ {remainingWants.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl p-6 border border-green-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <h3 className="text-xl font-bold">Eu do Futuro (10%)</h3>
        </div>
        <p className="text-3xl font-bold text-green-400">
          R$ {totalSaved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-slate-400 mt-2">
          Este valor deve ser poupado automaticamente todo mês
        </p>
      </div>
    </div>
  )

  const renderExpenses = () => (
    <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  )

  const renderCalculator = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold mb-4">Calculadora de Juros Compostos</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Valor inicial (R$)</label>
            <input
              type="number"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
              placeholder="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Aporte mensal (R$)</label>
            <input
              type="number"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
              placeholder="500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Taxa de juros (% ao ano)</label>
            <input
              type="number"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Período (anos)</label>
            <input
              type="number"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60"
              placeholder="10"
            />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-lg p-6 border border-[#dd9828]/30">
          <h4 className="text-lg font-bold mb-4">Resultado</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Valor final</p>
              <p className="text-2xl font-bold text-[#dd9828]">R$ 0,00</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Total investido</p>
              <p className="text-lg font-semibold">R$ 0,00</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Juros ganhos</p>
              <p className="text-lg font-semibold text-green-400">R$ 0,00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold mb-4">Informações da Conta</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <p className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                {user.name || 'Não informado'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <p className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                {user.email}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Plano</label>
              <p className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                {user.plan_type || 'Nenhum'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${user.plan_status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={user.plan_status === 'active' ? 'text-green-400' : 'text-red-400'}>
                  {user.plan_status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-2xl p-6 border border-[#dd9828]/30">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-8 h-8 text-[#dd9828]" />
          <h3 className="text-xl font-bold">Plano Ativo</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400">Plano atual</p>
            <p className="text-lg font-semibold">{user.plan_type || 'Nenhum'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Expira em</p>
            <p className="text-lg font-semibold">
              {user.plan_expires_at 
                ? new Date(user.plan_expires_at).toLocaleDateString('pt-BR')
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'expenses', name: 'Despesas', icon: CreditCard },
    { id: 'calculator', name: 'Calculadora', icon: Calculator },
    { id: 'profile', name: 'Perfil', icon: User }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040509] to-[#2b3747] text-white">
      {/* Header */}
      <header className="bg-[#040509]/95 backdrop-blur-sm border-b border-[#dd9828]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26c35718-2d71-4663-94a3-23457b66070d.png" 
                alt="UP Money Logo" 
                className="h-8 w-auto"
              />
              <div>
                <p className="text-sm text-slate-400">Bem-vindo,</p>
                <p className="font-semibold">{user.name || user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'expenses' && renderExpenses()}
            {activeTab === 'calculator' && renderCalculator()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>
    </div>
  )
}