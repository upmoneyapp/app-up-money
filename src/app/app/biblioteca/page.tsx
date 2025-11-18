'use client'

import { BookOpen, Download, FileText } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function BibliotecaPage() {
  const resources = [
    {
      id: 1,
      title: 'Guia Completo de Educação Financeira',
      description: 'Aprenda os fundamentos para organizar suas finanças pessoais',
      type: 'PDF',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Como Investir com Segurança',
      description: 'Descubra os melhores investimentos para iniciantes',
      type: 'PDF',
      icon: FileText,
      color: 'green'
    },
    {
      id: 3,
      title: 'Planilha de Controle Financeiro',
      description: 'Modelo completo para organizar seu orçamento',
      type: 'XLSX',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 4,
      title: 'E-book: Liberdade Financeira',
      description: 'Estratégias para alcançar a independência financeira',
      type: 'PDF',
      icon: FileText,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-400',
      green: 'from-green-500/20 to-green-500/10 border-green-500/30 text-green-400',
      purple: 'from-purple-500/20 to-purple-500/10 border-purple-500/30 text-purple-400',
      orange: 'from-[#dd9828]/20 to-[#dd9828]/10 border-[#dd9828]/30 text-[#dd9828]'
    }
    return colors[color] || colors.blue
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Biblioteca de Recursos</h1>
          <BookOpen className="w-8 h-8 text-[#dd9828]" />
        </div>
        
        <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 rounded-2xl p-6 border border-[#dd9828]/30">
          <h3 className="text-xl font-bold mb-2">📚 Materiais Exclusivos</h3>
          <p className="text-slate-300">
            Acesse nossa coleção de e-books, guias e planilhas para aprimorar sua educação financeira. 
            Todos os materiais foram cuidadosamente selecionados para ajudar você a alcançar seus objetivos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.map(resource => {
            const Icon = resource.icon
            return (
              <div 
                key={resource.id} 
                className={`bg-gradient-to-br ${getColorClasses(resource.color)} rounded-2xl p-6 border`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-white/20 rounded mt-1 inline-block">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-4">
                  {resource.description}
                </p>

                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Baixar Material</span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">📖 Artigos Recomendados</h3>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-1">Como criar um fundo de emergência</h4>
              <p className="text-sm text-slate-400">Aprenda a se proteger de imprevistos financeiros</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-1">Investimentos para iniciantes</h4>
              <p className="text-sm text-slate-400">Descubra por onde começar a investir seu dinheiro</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-1">Planejamento financeiro familiar</h4>
              <p className="text-sm text-slate-400">Organize as finanças de toda a família</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
