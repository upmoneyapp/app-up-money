'use client';

import { useState } from 'react';
import { Check, X, ChevronDown, Shield, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPlans, setShowPlans] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleBuyClick = () => {
    setShowPlans(true);
    // Scroll suave para a seção de planos
    setTimeout(() => {
      document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAlreadyBought = () => {
    router.push('/login');
  };

  const plans = [
    {
      name: 'Plano Mensal',
      price: 'R$ 47,90',
      period: '/mês',
      link: 'https://pay.hotmart.com/J102711621S?off=c0c94yc8',
      popular: false,
      features: [
        'Acesso completo ao app',
        'Método 60/30/10',
        'Todas as ferramentas',
        'Suporte prioritário'
      ]
    },
    {
      name: 'Plano Semestral',
      price: 'R$ 97,90',
      period: '/6 meses',
      link: 'https://pay.hotmart.com/J102711621S?off=hknpdaks',
      popular: true,
      savings: 'Economize 65%',
      features: [
        'Acesso completo ao app',
        'Método 60/30/10',
        'Todas as ferramentas',
        'Suporte prioritário',
        'Bônus exclusivos'
      ]
    },
    {
      name: 'Plano Anual',
      price: 'R$ 147,90',
      period: '/ano',
      link: 'https://pay.hotmart.com/J102711621S?off=dijt8g94',
      popular: false,
      savings: 'Economize 74%',
      features: [
        'Acesso completo ao app',
        'Método 60/30/10',
        'Todas as ferramentas',
        'Suporte prioritário',
        'Bônus exclusivos',
        'Atualizações vitalícias'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Como funciona o Método 60/30/10?',
      answer: 'O Método 60/30/10 divide sua renda em três partes: 60% para despesas essenciais, 30% para despesas não obrigatórias e 10% para reserva de emergência. É uma forma simples e eficaz de organizar suas finanças.'
    },
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas adicionais. Além disso, oferecemos garantia de 7 dias para reembolso total.'
    },
    {
      question: 'O app funciona em celular e computador?',
      answer: 'Sim! O UP Money é totalmente responsivo e funciona perfeitamente em smartphones, tablets e computadores. Acesse de qualquer dispositivo.'
    },
    {
      question: 'Preciso ter conhecimento em finanças?',
      answer: 'Não! O UP Money foi desenvolvido para ser simples e intuitivo. Qualquer pessoa pode usar, independente do nível de conhecimento em finanças.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Absolutamente! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger seus dados financeiros.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* PARTE 1 - Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e7a034]/10 via-transparent to-[#e7a034]/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Coluna Esquerda - Conteúdo */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                MÉTODO <span className="text-[#e7a034]">60/30/10</span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-6 sm:mb-8">
                Desligue o Piloto Automático
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e7a034] flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-200">
                    Saia do zero ao zero em 30 dias
                  </p>
                </div>
                
                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e7a034] flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-200">
                    Monte sua reserva de emergência
                  </p>
                </div>
                
                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e7a034] flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-200">
                    Tenha liberdade para gastar sem culpa
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleBuyClick}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#e7a034] hover:bg-[#d4941f] text-white text-base sm:text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  QUERO APLICAR O MÉTODO
                </button>
                
                <button
                  onClick={handleAlreadyBought}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg font-bold rounded-lg transition-all border-2 border-white/30"
                >
                  JÁ COMPREI
                </button>
              </div>
            </div>

            {/* Coluna Direita - Visualização do Método */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
                  Divisão Inteligente
                </h3>
                
                <div className="space-y-4">
                  {/* 60% Necessidades */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold text-sm sm:text-base">60% Necessidades</span>
                      <span className="text-[#e7a034] font-bold text-sm sm:text-base">Essencial</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 sm:h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  {/* 30% Desejos */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold text-sm sm:text-base">30% Desejos</span>
                      <span className="text-gray-400 font-bold text-sm sm:text-base">Lazer</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 sm:h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#4a5568] to-[#6b7280] h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  {/* 10% Futuro */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold text-sm sm:text-base">10% Eu do Futuro</span>
                      <span className="text-[#e7a034] font-bold text-sm sm:text-base">Investir</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 sm:h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#e7a034] to-[#d4941f] h-full rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 p-4 bg-[#e7a034]/10 rounded-lg border border-[#e7a034]/30">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    <span className="font-bold text-[#e7a034]">Pague-se primeiro!</span> Reserve 10% antes de qualquer gasto e construa seu futuro financeiro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Transição */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-transparent to-[#0a0e27]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Transforme Sua Vida Financeira Hoje
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10">
            Mais de 10.000 pessoas já estão no controle das suas finanças com o UP Money
          </p>
          <button
            onClick={handleBuyClick}
            className="px-6 sm:px-10 py-3 sm:py-4 bg-[#e7a034] hover:bg-[#d4941f] text-white text-base sm:text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            QUERO APLICAR O MÉTODO AGORA
          </button>
        </div>
      </section>

      {/* PARTE 5 - Seção de Planos */}
      {showPlans && (
        <section id="plans-section" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Escolha Seu Plano
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300">
                Invista no seu futuro financeiro com segurança
              </p>
            </div>

            {/* Cards de Planos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 sm:mb-16">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 transition-all hover:transform hover:scale-105 ${
                    plan.popular
                      ? 'border-[#e7a034] shadow-2xl shadow-[#e7a034]/20'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#e7a034] text-white px-4 py-1 rounded-full text-xs sm:text-sm font-bold">
                        MAIS POPULAR
                      </span>
                    </div>
                  )}

                  {plan.savings && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {plan.savings}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e7a034]">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 text-base sm:text-lg ml-2">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#e7a034] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-200 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 sm:py-4 text-center font-bold rounded-lg transition-all text-sm sm:text-base ${
                      plan.popular
                        ? 'bg-[#e7a034] hover:bg-[#d4941f] text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/30'
                    }`}
                  >
                    COMEÇAR MINHA TRANSFORMAÇÃO
                  </a>
                </div>
              ))}
            </div>

            {/* Garantia e Formas de Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16">
              {/* Garantia */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
                <div className="flex justify-center mb-4">
                  <img
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/52e561c9-5c28-4c8b-8ead-5c362ca010ec.png"
                    alt="Garantia de 7 Dias"
                    className="h-20 sm:h-24 w-auto"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Garantia de 7 Dias
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Experimente sem riscos! Se não gostar, devolvemos 100% do seu dinheiro em até 7 dias.
                </p>
              </div>

              {/* Formas de Pagamento */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
                <div className="flex justify-center mb-4">
                  <CreditCard className="w-16 h-16 sm:w-20 sm:h-20 text-[#e7a034]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Pagamento Seguro
                </h3>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  Aceitamos todas as formas de pagamento
                </p>
                <img
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/6b5c9d8e-aec2-4867-b3c5-8d0f9c1d4cc9.png"
                  alt="Formas de Pagamento"
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            </div>

            {/* Bônus Exclusivos */}
            <div className="bg-gradient-to-r from-[#e7a034]/10 to-[#e7a034]/5 rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#e7a034]/30 mb-12 sm:mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Bônus Exclusivos
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  Ao adquirir qualquer plano, você recebe gratuitamente:
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <img
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7762f00a-dd18-4c4e-9bb3-16c755b1777a.png"
                  alt="E-books Bônus"
                  className="h-32 sm:h-40 lg:h-48 w-auto"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-bold text-white mb-2 text-sm sm:text-base">📚 5 E-books Premium</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Guias completos sobre educação financeira</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-bold text-white mb-2 text-sm sm:text-base">🎯 Planilhas Exclusivas</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Templates prontos para organizar suas finanças</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-bold text-white mb-2 text-sm sm:text-base">💡 Comunidade VIP</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Acesso ao grupo exclusivo de membros</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8 sm:mb-10">
                Perguntas Frequentes
              </h3>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-semibold text-white text-sm sm:text-base pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#e7a034] flex-shrink-0 transition-transform ${
                          openFaq === index ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openFaq === index && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center mt-12 sm:mt-16 lg:mt-20">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                Pronto para Transformar Suas Finanças?
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10">
                Junte-se a milhares de pessoas que já estão no controle
              </p>
              <button
                onClick={() => {
                  document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-[#e7a034] hover:bg-[#d4941f] text-white text-lg sm:text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                COMEÇAR MINHA TRANSFORMAÇÃO
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0a0e27] border-t border-white/10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png"
              alt="UP Money Logo"
              className="h-10 sm:h-12 w-auto mx-auto mb-4"
            />
            <p className="text-gray-400 text-xs sm:text-sm mb-4">
              © 2024 UP Money. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs">
              Desligue o piloto automático e assuma o controle da sua vida financeira.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
