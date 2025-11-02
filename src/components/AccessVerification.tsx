'use client'

import { useState } from 'react'
import { checkUserAccessByEmailOnly } from '@/lib/auth'
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

interface AccessVerificationProps {
  onAccessGranted: (user: any) => void
}

export default function AccessVerification({ onAccessGranted }: AccessVerificationProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Por favor, digite seu email')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { hasAccess, user } = await checkUserAccessByEmailOnly(email)

      if (hasAccess && user) {
        setSuccess('Acesso liberado! Redirecionando...')
        setTimeout(() => {
          onAccessGranted(user)
        }, 1500)
      } else {
        setError('Email não encontrado ou sem acesso ativo. Verifique se você já realizou o pagamento.')
      }
    } catch (error) {
      console.error('Erro na verificação:', error)
      setError('Erro ao verificar acesso. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040509] to-[#2b3747] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-[#dd9828]/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26c35718-2d71-4663-94a3-23457b66070d.png" 
                alt="UP Money Logo" 
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Acesso ao UP Money
            </h1>
            <p className="text-slate-300">
              Digite o email usado na compra para acessar o aplicativo
            </p>
          </div>

          <form onSubmit={handleVerifyAccess} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email da compra
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-[#dd9828]/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#dd9828] focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] py-3 px-4 rounded-lg font-semibold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#040509] border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Acessar Aplicativo</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#dd9828]/20">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-4">
                Ainda não tem acesso?
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#dd9828] hover:text-[#dd9828]/80 font-medium text-sm transition-colors duration-200"
              >
                Voltar para a página de vendas
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="bg-[#dd9828]/10 rounded-lg p-4 border border-[#dd9828]/20">
              <p className="text-slate-300 text-sm">
                <strong className="text-[#dd9828]">Dica:</strong> Use o mesmo email que você forneceu na hora da compra na Hotmart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}