'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  BarChart3, 
  CreditCard, 
  PieChart, 
  TrendingUp, 
  Target, 
  Calculator, 
  BookOpen, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/')
        return
      }

      // Verificar se usuário está ativo
      const { data: userData } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (!userData?.is_active) {
        router.push('/')
        return
      }

      setUser(session.user)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const menuItems = [
    { id: 'dashboard', name: 'Painel de Controle', icon: BarChart3, path: '/app' },
    { id: 'orcamento', name: 'Orçamento', icon: CreditCard, path: '/app/orcamento' },
    { id: 'quadro-cortes', name: 'Quadro de Cortes', icon: TrendingUp, path: '/app/quadro-cortes' },
    { id: 'patrimonio', name: 'Patrimônio', icon: PieChart, path: '/app/patrimonio' },
    { id: 'ganho-liquido', name: 'Ganho Líquido', icon: TrendingUp, path: '/app/ganho-liquido' },
    { id: 'objetivos', name: 'Objetivos', icon: Target, path: '/app/objetivos' },
    { id: 'simulador-juros', name: 'Simulador de Juros', icon: Calculator, path: '/app/simulador-juros' },
    { id: 'biblioteca', name: 'Biblioteca', icon: BookOpen, path: '/app/biblioteca' }
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-[#040509] to-[#2b3747] text-white">
      {/* Header */}
      <header className="bg-[#040509]/95 backdrop-blur-sm border-b border-[#dd9828]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:text-[#dd9828] transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26c35718-2d71-4663-94a3-23457b66070d.png" 
                alt="UP Money Logo" 
                className="h-8 w-auto"
              />
              <div className="hidden sm:block">
                <p className="text-sm text-slate-400">Bem-vindo,</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="space-y-2 sticky top-24">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Sidebar - Mobile */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <div className="fixed inset-y-0 left-0 w-64 bg-[#040509] p-4" onClick={(e) => e.stopPropagation()}>
                <nav className="space-y-2 mt-16">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.path
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          router.push(item.path)
                          setSidebarOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
