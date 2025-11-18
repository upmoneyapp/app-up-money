'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      // Se já está logado, redirecionar para o app
      if (session) {
        router.push('/app');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Se fez login, redirecionar para o app
      if (session) {
        router.push('/app');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Redirecionamento será feito pelo onAuthStateChange
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Ocorreu um erro. Tente novamente.' 
      });
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e7a034] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e7a034] to-[#000000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png" 
            alt="UP Money Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesse o UP Money
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Entre com suas credenciais para acessar o aplicativo
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              minLength={6}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'error' 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            }`}>
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={authLoading}
            className="w-full bg-[#e7a034] hover:bg-[#d4941f] text-white"
          >
            {authLoading ? 'Processando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/pv/planos')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#e7a034] transition-colors"
          >
            Não tem uma conta? Cadastre-se
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/pv')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#e7a034] transition-colors"
          >
            ← Voltar para página de vendas
          </button>
        </div>
      </div>
    </div>
  );
}
