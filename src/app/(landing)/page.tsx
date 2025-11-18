'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import Script from 'next/script';

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Timer de 24 horas
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TL5MD4NC');`}
      </Script>

      <div className="min-h-screen bg-white">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TL5MD4NC"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Header com Logo e Botão "Já Comprei" */}
        <header className="bg-[#04050A] py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png" 
              alt="UP Money Logo" 
              className="h-10 w-auto"
            />
            <button
              onClick={() => {
                window.location.href = '/login';
              }}
              className="px-3 py-1.5 text-xs sm:text-sm bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Já Comprei
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#0d1117] via-[#1a1f2e] to-[#263240] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              Método Validado por Thiago Nigro
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="text-[#cc8d23]">MÉTODO 60/30/10</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Desligue o Piloto Automático
            </p>
            <p className="text-lg sm:text-xl text-white mb-8">
              Assuma o controle da sua vida financeira com o método milenar usado desde a Babilônia
            </p>
            <div className="space-y-3 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl flex-shrink-0">✅</span>
                <p className="text-white text-lg">Saia do Zero a Zero em 30 dias</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl flex-shrink-0">✅</span>
                <p className="text-white text-lg">Monte sua Reserva de Emergência</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl flex-shrink-0">✅</span>
                <p className="text-white text-lg">Tenha liberdade para gastar sem culpa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Imagem Principal */}
        <section className="bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/66f8d392-c4c2-43d9-8d52-8ab6126e094e.png" 
              alt="Aplicativo UP Money em diferentes dispositivos" 
              className="w-full max-w-3xl mx-auto h-auto"
            />
          </div>
        </section>

        {/* Sessão 1 */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Você trabalha o mês inteiro... e mesmo assim nunca vê o dinheiro?
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Está na hora de parar de viver no piloto automático e assumir o controle do seu dinheiro com o método milenar 60/30/10 — agora traduzido em um app prático, inteligente e transformador: <strong>UP Money</strong>
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Pare de viver no piloto automático. Aprenda o segredo milenar que transformou um simples escriba no homem mais rico da Babilônia - e como ele pode fazer o mesmo por você hoje.
            </p>
            
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 mt-8 text-center">
              VOCÊ PAGA A TODOS... MENOS A SI MESMO.
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              Todo mês o mesmo ciclo: o salário entra e some. Você paga o banco, o aluguel, o cartão, a escola — e no fim, sobra o quê? <strong>Nada</strong>
            </p>
            <p className="text-lg text-gray-700 mb-4">
              A maioria das pessoas vive assim, <em>submissa ao dinheiro</em>, sem perceber. Mas isso não é falta de sorte. É falta de método.
            </p>
            <blockquote className="border-l-4 border-[#e7a034] pl-4 italic text-gray-600 mb-4">
              "Quem gasta tudo o que ganha, trabalha para os outros." — Arkad
            </blockquote>
            <p className="text-lg font-semibold text-gray-900 mb-4">
              O problema nunca foi o quanto você ganha — e sim o quanto deixa escapar.
            </p>
            <p className="text-lg text-gray-700">
              Você pode dobrar o que ganha, e ainda assim continuar no zero a zero. Sem controle, não há liberdade.
            </p>
          </div>
        </section>

        {/* CTA - Transforme sua vida financeira hoje */}
        <section className="bg-[#ffffff] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Transforme sua vida financeira hoje
            </h2>
            <button
              onClick={() => {
                const plansSection = document.getElementById('plans-section');
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-lg font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all shadow-lg"
            >
              QUERO APLICAR O MÉTODO
            </button>
          </div>
        </section>

        {/* Sessão 2 */}
        <section className="bg-gradient-to-b from-[#0d1117] via-[#1a1f2e] to-[#263240] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              O SEGREDO DESCOBERTO HÁ MAIS DE 4.000 ANOS NA BABILÔNIA
            </h2>
            <p className="text-lg mb-4">
              Na antiga Babilônia, Arkad — um simples escriba — tornou-se o homem mais rico de sua cidade. Seu segredo?
            </p>
            <blockquote className="border-l-4 border-[#e7a034] pl-4 italic text-gray-300 mb-6">
              "Uma parte de tudo o que você ganha é sua, e deve ser guardada."
            </blockquote>
            <p className="text-lg mb-6">
              Essa foi a semente do método 60/30/10 — simples, eterno e comprovado pelo tempo.
            </p>
            <p className="text-lg mb-8">
              Enquanto a maioria segue o ciclo vicioso de pagar todas as contas primeiro e torcer para sobrar dinheiro, o Sistema Piloto Automático OFF aplica a fórmula 60/30/10 em ORDEM REVERSA. <strong>Você paga a SI MESMO primeiro</strong>, desativando permanentemente o piloto automático da escassez.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold mb-6 mt-8 text-center">
              A FÓRMULA QUE EQUILIBRA SUA VIDA FINANCEIRA SEM SOFRIMENTO
            </h3>
            <blockquote className="border-l-4 border-[#e7a034] pl-4 italic text-gray-300 mb-4">
              "Pague a si mesmo, pague aos outros, e só depois desfrute."
            </blockquote>
            <p className="text-lg">
              A diferença está na <strong>ORDEM</strong>: A maioria gasta primeiro e tenta guardar o que sobra (e nunca sobra). O método correto é <strong>separar os 10% PRIMEIRO</strong>, depois pagar as contas essenciais, e só então usar o restante para o seu lazer e conforto.
            </p>
          </div>
        </section>

        {/* Sessão 3 */}
        <section className="bg-[#ffffff] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              O PAPEL DOS ATIVOS NO SEU PROCESSO DE ENRIQUECIMENTO
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Ativo é tudo aquilo que <strong>COLOCA dinheiro no seu bolso</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-8">
              <li>Reserva de emergência</li>
              <li>Ações</li>
              <li>Fundos imobiliários</li>
              <li>Renda fixa</li>
              <li>Investimentos internacionais</li>
            </ul>

            <p className="text-lg text-gray-700 mb-4">
              Enquanto isso, passivos são tudo que <strong>TIRA dinheiro do seu bolso</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-6">
              <li>Dívidas com juros altos (rotativo do cartão de crédito, cheque especial…)</li>
              <li>Bens que só geram despesas (carro, casa…)</li>
              <li>Gastos desnecessários (iPhone do ano, roupas novas todos os meses…)</li>
            </ul>

            <blockquote className="border-l-4 border-[#e7a034] pl-4 italic text-gray-600 text-lg">
              "Ou você controla o dinheiro, ou ele controla você."
            </blockquote>
          </div>
        </section>

        {/* CTA - Quero Controlar Meu Dinheiro */}
        <section className="bg-[#ffffff] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => {
                const plansSection = document.getElementById('plans-section');
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-lg font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all shadow-lg"
            >
              QUERO CONTROLAR MEU DINHEIRO
            </button>
          </div>
        </section>

        {/* Sessão 4 */}
        <section className="bg-[#ffffff] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              TUDO QUE VOCÊ PRECISA PARA SAIR DO ZERO A ZERO ESTÁ AQUI
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              O UP Money automatiza o método 60/30/10, fazendo o dinheiro finalmente trabalhar por você através de ferramentas exclusivas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Painel de Controle</h3>
                  <p className="text-gray-700">Método personalizado para sua realidade.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛒</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Orçamento</h3>
                  <p className="text-gray-700">Liste todo o seu orçamento e veja para onde vai cada centavo.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✂</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quadro de cortes</h3>
                  <p className="text-gray-700">Visualize o impacto de pequenos ajustes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Planilha da riqueza</h3>
                  <p className="text-gray-700">Acompanhe seu crescimento mês a mês.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quadro de metas</h3>
                  <p className="text-gray-700">Defina sonhos e veja a barra de progresso crescer.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💸</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Ganho Líquido</h3>
                  <p className="text-gray-700">Descubra quanto realmente sobrou do seu período — e encare a sua realidade.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Calculadora de juros compostos</h3>
                  <p className="text-gray-700">Veja como o tempo multiplica o que você guarda.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bônus Exclusivos */}
        <section className="bg-gradient-to-b from-[#d4dce6] via-[#e8eef5] to-[#F2F5FA] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              BÔNUS EXCLUSIVOS
            </h2>
            <div className="text-center mb-4">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/ddaa314e-5145-43e0-ab9f-275da067793d.png" 
                alt="Ebooks de finanças" 
                className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-lg"
              />
              <p className="text-lg font-semibold text-[#e7a034] mt-4">
                EBOOKS GRATUITOS - OFERTA LIMITADA APENAS PARA OS 50 PRIMEIROS
              </p>
            </div>
          </div>
        </section>

        {/* CTA - Quero Aproveitar os Bônus */}
        <section className="bg-gradient-to-b from-[#F2F5FA] via-[#e8eef5] to-[#d4dce6] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => {
                const plansSection = document.getElementById('plans-section');
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-lg font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all shadow-lg"
            >
              QUERO APROVEITAR OS BÔNUS
            </button>
          </div>
        </section>

        {/* Sessão 5 */}
        <section className="bg-[#ffffff] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              O QUE VOCÊ VAI CONQUISTAR COM O MÉTODO 60-30-10:
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Escape do Ciclo "Zero a Zero" em 30 Dias</h3>
                  <p className="text-gray-700">Transforme "sempre faltando" em "sempre sobrando" no final do mês</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✅</span>
                <div>
                  <p className="text-gray-700"><strong>Você vai aprender como montar uma Reserva de Emergência do zero</strong> — e finalmente sentir a segurança de ter o controle do seu dinheiro.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Mapeamento Financeiro Completo</h3>
                  <p className="text-gray-700">Visualize com clareza absoluta o destino de cada centavo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Liberdade Para Gastos Espontâneos Sem Culpa</h3>
                  <p className="text-gray-700">Compre o que quiser sem ansiedade ou remorso</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sono Tranquilo Garantido</h3>
                  <p className="text-gray-700">Elimine a ansiedade financeira que te mantém acordado à noite</p>
                </div>
              </div>
            </div>

            <p className="text-lg font-semibold text-[#e7a034] mb-4">
              A ORDEM É A CHAVE DO SUCESSO: Pague-se primeiro, depois pague os outros, depois desfrute.
            </p>
            <blockquote className="border-l-4 border-[#e7a034] pl-4 italic text-gray-600">
              "O ser humano não foi feito para sobrar. Se você investir apenas o que sobra, nunca sobrará nada."
            </blockquote>
          </div>
        </section>

        {/* Imagem de Juros */}
        <section className="bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              O PODER DOS JUROS COMPOSTOS AO SEU FAVOR
            </h2>
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/8fc6911e-e696-4b2a-8c85-432af409d57c.png" 
              alt="Simulador de Juros Compostos" 
              className="w-full max-w-3xl mx-auto h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Sessão 6 */}
        <section className="bg-[#ffffff] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              Investindo apenas 10% do seu salário todo mês, veja a diferença ao longo do tempo:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Em 34 meses (reserva de emergência completa):</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Apenas guardando: R$20.400</li>
                <li>Na poupança: R$21.830</li>
                <li>No Tesouro Selic: R$24.000</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Em 50 anos:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Apenas guardando: R$360.000</li>
                <li>Na poupança: R$4.800.000</li>
                <li>No Tesouro Selic: R$28.000.000 (R$24.000.000 após impostos)</li>
              </ul>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              UM MÉTODO MILENAR, COMPROVADO POR GERAÇÕES — E VALIDADO POR ESPECIALISTAS
            </h3>

            <div className="space-y-6 mb-8">
              <div>
                <p className="font-semibold text-gray-900 mb-2">🏛 Arkad – O Homem Mais Rico da Babilônia</p>
                <blockquote className="border-l-4 border-[#e7a034] pl-4 italic text-gray-600">
                  "Uma parte de tudo o que você ganha é sua, e deve ser guardada."
                </blockquote>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">💼 Thiago Nigro – Do Mil ao Milhão</p>
                <blockquote className="border-l-4 border-[#e7a034] pl-4 italic text-gray-600">
                  "Antes de investir, organize. O método 60/30/10 é simples e eficaz."
                </blockquote>
              </div>
            </div>

            <div className="text-center my-12">
              <p className="text-2xl font-bold text-gray-900 mb-4">
                🤔 Você investiria o valor de uma pizza no futuro da sua vida financeira?
              </p>
              <blockquote className="text-xl italic text-gray-700">
                "A melhor Hora para ter começado foi há 20 anos. A segunda melhor é agora"
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA - Quero Aplicar o Método Agora */}
        <section className="bg-[#ffffff] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => {
                const plansSection = document.getElementById('plans-section');
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-lg font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all shadow-lg"
            >
              QUERO APLICAR O MÉTODO AGORA
            </button>
          </div>
        </section>

        {/* Provas Sociais */}
        <section className="bg-gradient-to-b from-[#0d1117] via-[#1a1f2e] to-[#263240] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12 text-center">
              O QUE NOSSOS USUÁRIOS ESTÃO DIZENDO:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Depoimento 1 - Carlos */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9cb6dfd1-22fc-46dd-b542-c497436228c9.jpg"
                    alt="Carlos M."
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Carlos M.</p>
                    <p className="text-sm text-gray-600">31 anos</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Ganho R$6.500 como analista de sistemas e sempre acreditei que precisava ganhar mais para conseguir poupar. Após 5 meses usando o UP Money, já acumulei R$3.500 em reservas e continuo saindo com amigos e mantendo minhas assinaturas favoritas."
                </p>
              </div>

              {/* Depoimento 2 - Patrícia */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/66d21652-aae1-4b7f-ac88-939544303400.jpg"
                    alt="Patrícia L."
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Patrícia L.</p>
                    <p className="text-sm text-gray-600">38 anos</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Como profissional autônoma com renda variável, achei que seria impossível me organizar. O Sistema Piloto Automático OFF adaptou-se perfeitamente à minha realidade e, pela primeira vez em 8 anos, tenho uma reserva sólida de R$22.000."
                </p>
              </div>

              {/* Depoimento 3 - Fernanda e Rodrigo */}
              <div className="bg-white rounded-lg p-6 shadow-lg md:col-span-2 md:max-w-2xl md:mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/51038933-bd7d-4c4b-9960-0cd44f59d718.jpg"
                    alt="Fernanda e Rodrigo"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Fernanda e Rodrigo</p>
                    <p className="text-sm text-gray-600">35 e 37 anos</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Meu marido e eu brigávamos constantemente por dinheiro, mesmo com uma renda familiar de R$11.000. Depois do método, não só paramos de discutir como já planejamos nossa primeira viagem internacional paga à vista!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Escolha seu Plano */}
        <section id="plans-section" className="bg-gradient-to-b from-[#0f1419] via-[#1f2329] to-[#2a2d32] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
              OFERTA ESPECIAL POR TEMPO LIMITADO
            </h2>
            
            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <Clock className="text-[#e7a034]" size={24} />
              <p className="text-white text-lg">Expira em:</p>
              <div className="flex gap-2">
                <div className="bg-white rounded-lg px-3 py-2 min-w-[60px] text-center">
                  <span className="text-2xl font-bold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <p className="text-xs text-gray-600">horas</p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 min-w-[60px] text-center">
                  <span className="text-2xl font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <p className="text-xs text-gray-600">minutos</p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 min-w-[60px] text-center">
                  <span className="text-2xl font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <p className="text-xs text-gray-600">segundos</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-12 text-center">
              ESCOLHA SEU PLANO
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Plano Mensal */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensal</h3>
                <p className="text-sm text-gray-600 mb-4">Ideal para quem quer começar a transformação financeira com flexibilidade mensal</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#e7a034]">R$ 47,90</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <a
                  href="https://pay.hotmart.com/J102711621S?off=c0c94yc8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-center font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all"
                >
                  COMEÇAR AGORA
                </a>
              </div>

              {/* Plano Semestral */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-[#e7a034] relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#e7a034] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MAIS POPULAR
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Semestral</h3>
                <p className="text-sm text-gray-600 mb-4">Melhor custo-benefício no tempo! Perfeito para quem quer resultados consistentes com economia significativa e tempo suficiente para consolidar os hábitos</p>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-[#e7a034]">6x de R$18,37</span>
                </div>
                <div className="mb-6">
                  <span className="text-lg text-gray-600">ou R$97,90 à vista</span>
                </div>
                <a
                  href="https://pay.hotmart.com/J102711621S?off=hknpdaks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-center font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all"
                >
                  QUERO ECONOMIZAR
                </a>
              </div>

              {/* Plano Anual */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Anual</h3>
                <p className="text-sm text-gray-600 mb-4">Máxima economia no longo prazo! Para quem está comprometido com transformação completa e quer o melhor investimento no longo prazo</p>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-[#e7a034]">12x de R$15,30</span>
                </div>
                <div className="mb-6">
                  <span className="text-lg text-gray-600">ou R$147,90 à vista</span>
                </div>
                <a
                  href="https://pay.hotmart.com/J102711621S?off=dijt8g94"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-center font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all"
                >
                  MÁXIMA ECONOMIA
                </a>
              </div>
            </div>

            {/* Garantia e Pagamento Seguro */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white mb-8">
              <div className="text-center">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/305a962c-fc95-4ab3-9012-698620a37cc8.png"
                  alt="Garantia de 7 Dias"
                  className="w-24 h-24 mx-auto mb-2"
                />
                <p className="font-semibold">Garantia de 7 Dias</p>
                <p className="text-sm text-gray-300">100% do seu dinheiro de volta</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <p className="font-semibold">Pagamento Seguro</p>
                <p className="text-sm text-gray-300">Processado pela Hotmart</p>
              </div>
            </div>

            {/* Imagem de Formas de Pagamento */}
            <div className="text-center">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0a3dd4b9-8c57-44b1-87ae-bd2092fe7ecb.png" 
                alt="Formas de pagamento aceitas" 
                className="w-full max-w-2xl mx-auto h-auto"
              />
            </div>
          </div>
        </section>

        {/* Perguntas Frequentes */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              PERGUNTAS FREQUENTES
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "E se eu já tentei outros métodos e falhei?",
                  answer: "Perfeito! O Sistema Piloto Automático OFF™ foi desenvolvido especificamente para pessoas que já tentaram outras abordagens sem sucesso. Nossa metodologia de inversão comportamental funciona mesmo para quem \"já tentou de tudo\"."
                },
                {
                  question: "Quanto tempo preciso dedicar por semana?",
                  answer: "Apenas 15 minutos! O sistema foi desenhado para profissionais ocupados que não têm tempo para controles complexos."
                },
                {
                  question: "Funciona para qualquer nível de renda?",
                  answer: "Sim! O método é adaptável para qualquer nível de renda! O destrave financeiro da sua vida não está na sua renda, e sim no seu comportamento."
                },
                {
                  question: "Preciso entender de investimentos?",
                  answer: "Absolutamente não! O sistema foca primeiro na organização e construção de reservas. Questões de investimento são abordadas apenas quando você já estiver com as bases sólidas."
                },
                {
                  question: "Quanto tempo até ver os primeiros resultados?",
                  answer: "A maioria dos usuários percebe mudanças significativas nos primeiros 30 dias, com resultados financeiros concretos em 60-90 dias."
                }
              ].map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDown 
                      className={`text-gray-600 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Frase Final */}
        <section className="bg-[#ffffff] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl font-bold text-gray-900">
              UP Money — da Babilônia ao seu bolso. Simples, Inteligente e Transformador.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-[#0d1117] via-[#1a1f2e] to-[#263240] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center text-white">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png" 
              alt="UP Money Logo" 
              className="h-8 w-auto mx-auto mb-4"
            />
            <p className="text-sm text-gray-300">
              © 2025 UP Money. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
