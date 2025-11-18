'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PlanosPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png" 
            alt="UP Money Logo" 
            className="h-12 w-auto"
          />
          <button
            onClick={() => router.push('/login')}
            className="text-gray-600 hover:text-[#e7a034] transition-colors"
          >
            Já tem conta? Entrar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Comece sua transformação financeira hoje mesmo
          </p>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20 px-4 -mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Mensal */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-[#cc8d23] transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensal</h3>
                <p className="text-gray-600 text-sm mb-4">Ideal para quem quer começar a transformação financeira com flexibilidade mensal</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  R$ 47<span className="text-lg">/mês</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Acesso completo ao aplicativo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Método 60/30/10 completo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Suporte via comunidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Atualizações constantes</span>
                </li>
              </ul>

              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                COMEÇAR AGORA
              </Button>
            </div>

            {/* Plano Semestral - DESTAQUE */}
            <div className="bg-gradient-to-b from-[#cc8d23] to-[#b37a1f] rounded-2xl shadow-2xl p-8 border-4 border-[#cc8d23] transform md:scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                MAIS POPULAR
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Semestral</h3>
                <p className="text-white/90 text-sm mb-4">Melhor custo-benefício no tempo! Perfeito para quem quer resultados consistentes com economia significativa e tempo suficiente para consolidar os hábitos</p>
                <div className="text-4xl font-bold text-white mb-2">
                  R$ 197<span className="text-lg">/6 meses</span>
                </div>
                <p className="text-white/90 text-sm">Economia de R$ 85</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Tudo do plano mensal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">6 meses de acesso garantido</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Economia de 30%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Bônus exclusivos</span>
                </li>
              </ul>

              <Button className="w-full bg-white hover:bg-gray-100 text-[#cc8d23] font-bold">
                QUERO ECONOMIZAR
              </Button>
            </div>

            {/* Plano Anual */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-[#cc8d23] transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Anual</h3>
                <p className="text-gray-600 text-sm mb-4">Máxima economia no longo prazo! Para quem está comprometido com transformação completa e quer o melhor investimento no longo prazo</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  R$ 297<span className="text-lg">/ano</span>
                </div>
                <p className="text-green-600 text-sm font-semibold">Economia de R$ 267</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tudo dos planos anteriores</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">12 meses de acesso garantido</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Economia de 47%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Todos os bônus + extras</span>
                </li>
              </ul>

              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                MÁXIMA ECONOMIA
              </Button>
            </div>
          </div>

          {/* Garantia */}
          <div className="mt-16 text-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/305a962c-fc95-4ab3-9012-698620a37cc8.png" 
              alt="Garantia 7 dias" 
              className="w-32 h-32 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Garantia Incondicional de 7 Dias
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Teste o método sem riscos. Se não gostar, devolvemos 100% do seu dinheiro.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 UP Money. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
