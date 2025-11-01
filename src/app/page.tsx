'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  PieChart, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Star,
  Clock,
  Shield,
  Users,
  Zap,
  Award,
  BookOpen,
  ArrowRight,
  Play,
  Download,
  Gift,
  Sparkles
} from 'lucide-react';
import { useTracking, HOTMART_CHECKOUT_URLS } from '@/lib/tracking';

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Hook de tracking para parâmetros UTM e conversões
  const { trackConversion, trackingParams } = useTracking();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Função para lidar com cliques nos botões de checkout
  const handleCheckoutClick = (planType: 'monthly' | 'semester' | 'annual', planName: string) => {
    let baseUrl = HOTMART_CHECKOUT_URLS.MONTHLY; // URL padrão
    
    // Definir URL específica baseada no plano (você pode personalizar essas URLs)
    switch (planType) {
      case 'monthly':
        baseUrl = HOTMART_CHECKOUT_URLS.MONTHLY;
        break;
      case 'semester':
        baseUrl = HOTMART_CHECKOUT_URLS.SEMESTER;
        break;
      case 'annual':
        baseUrl = HOTMART_CHECKOUT_URLS.ANNUAL;
        break;
    }
    
    // Construir URL com tracking
    const trackedUrl = trackConversion(planName, baseUrl);
    
    // Abrir em nova aba
    window.open(trackedUrl, '_blank', 'noopener,noreferrer');
  };

  // Função para scroll suave até a seção de planos
  const scrollToPlans = () => {
    const plansSection = document.getElementById('plans-section');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      name: "Marina Silva",
      age: 34,
      profession: "Campinas - SP",
      image: "https://i.pinimg.com/474x/de/cb/2f/decb2f0a0a16b6484a5f3c318ea3ecc3.jpg",
      text: "Meu marido e eu brigávamos constantemente por dinheiro, mesmo com uma renda familiar de R$11.000. Depois do método, não só paramos de discutir como já estamos construindo nossa reserva de emergência.",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      age: 31,
      profession: "Pouso Alegre - MG",
      image: "https://i.pinimg.com/564x/40/72/de/4072dec2f22a48c70577d1c3a4fb0ca9.jpg",
      text: "Achava que precisava ganhar mais pra sobrar. Hoje tenho R$3.500 guardados e vivo melhor que antes. O UP Money é revolucionário!",
      rating: 5
    },
    {
      name: "Ana Costa",
      age: 28,
      profession: "Canoas - RS",
      image: "https://i.pinimg.com/236x/ac/9c/d1/ac9cd15382c065857b83bb461ca54174.jpg",
      text: "Saí do zero a zero em apenas 2 meses. Agora tenho controle total das minhas finanças e durmo tranquila sabendo que tenho reserva.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Controle de Orçamento Inteligente",
      description: "Organize suas finanças automaticamente com o método 60/30/10"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Metas e Progresso",
      description: "Defina objetivos financeiros e acompanhe seu progresso em tempo real"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Calculadora de Juros Compostos",
      description: "Veja como seus investimentos podem crescer ao longo do tempo"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Quadro de Cortes",
      description: "Nunca mais esqueça de uma conta importante"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Planilha da Riqueza Mensal",
      description: "Acompanhe sua evolução financeira mês a mês"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Ganho Líquido Anual",
      description: "Descubra quanto você realmente ganha por ano"
    }
  ];

  const benefits = [
    "Sair do ciclo 'zero a zero' em 30 dias",
    "Montar sua reserva de emergência do zero",
    "Mapear seus gastos com clareza total",
    "Ter liberdade para gastar sem culpa",
    "Dormir tranquilo com dinheiro controlado",
    "Aplicar método validado por especialistas",
    "Reprogramar sua mentalidade financeira",
    "Automatizar seu processo de poupança"
  ];

  const faqData = [
    {
      question: "O método 60/30/10 realmente funciona?",
      answer: "Sim! É um método milenar usado desde a Babilônia e validado por especialistas como Thiago Nigro. Milhares de pessoas já transformaram suas vidas financeiras com ele."
    },
    {
      question: "Preciso ter conhecimento em finanças?",
      answer: "Não! O UP Money foi criado para iniciantes. Tudo é explicado de forma simples e prática, sem complicações."
    },
    {
      question: "Funciona com qualquer renda?",
      answer: "Sim! O método funciona independente da sua renda. O importante é a organização e disciplina, não o valor que você ganha."
    },
    {
      question: "Quanto tempo para ver resultados?",
      answer: "Os primeiros resultados aparecem em 30 dias. Em 3 meses você já terá uma reserva sólida e controle total das finanças."
    },
    {
      question: "Tem garantia?",
      answer: "Sim! Oferecemos 7 dias de garantia incondicional. Se não ficar satisfeito, devolvemos 100% do seu dinheiro."
    },
    {
      question: "Como funciona o acesso?",
      answer: "Após a compra, você recebe acesso imediato ao app e todos os bônus por email. Funciona em qualquer dispositivo."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040509] to-[#2b3747] overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#040509]/95 backdrop-blur-sm shadow-sm z-50 border-b border-[#dd9828]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26c35718-2d71-4663-94a3-23457b66070d.png" 
                alt="UP Money Logo" 
                className="h-8 w-auto"
              />
            </div>
            <button 
              onClick={scrollToPlans}
              className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-3 sm:px-6 py-2 rounded-full font-semibold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#040509] via-[#2b3747] to-[#040509] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-[#dd9828]/5 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-[#dd9828]/20 text-[#dd9828] px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Método Validado por Thiago Nigro</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-left">
                  <span className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 bg-clip-text text-transparent">
                    MÉTODO 60/30/10
                  </span>
                  <br />
                  Desligue o Piloto Automático
                </h1>
                <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed text-center lg:text-left">
                  Assuma o controle da sua vida financeira com o método milenar usado desde a Babilônia
                </p>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 text-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Saia do zero a zero em 30 dias</span>
                </div>
                <div className="flex items-center space-x-3 text-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Monte sua reserva de emergência</span>
                </div>
                <div className="flex items-center space-x-3 text-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Tenha liberdade para gastar sem culpa</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={scrollToPlans}
                  className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-6 sm:px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-2xl hover:shadow-[#dd9828]/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>QUERO APLICAR O MÉTODO</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#2b3747]/30 to-[#040509]/30 backdrop-blur-sm rounded-3xl p-8 border border-[#dd9828]/20">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">O MÉTODO 60/30/10 NA PRÁTICA</h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 rounded-lg p-4">
                        <div className="text-lg font-semibold text-[#040509]">10% - Eu do Futuro</div>
                        <div className="text-sm text-[#040509]/80">Reserva e investimentos</div>
                      </div>
                      <div className="bg-gradient-to-r from-[#2b3747] to-[#2b3747]/80 rounded-lg p-4 border border-[#dd9828]/30">
                        <div className="text-lg font-semibold">60% - Necessidades</div>
                        <div className="text-sm opacity-90">Despesas essenciais</div>
                      </div>
                      <div className="bg-gradient-to-r from-[#040509] to-[#2b3747] rounded-lg p-4 border border-[#dd9828]/20">
                        <div className="text-lg font-semibold">30% - Desejos</div>
                        <div className="text-sm opacity-90">Lazer e estilo de vida</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#040509] mb-8">
            Você trabalha o mês inteiro… e nunca vê o dinheiro?
          </h2>
          <div className="text-xl text-[#2b3747] leading-relaxed space-y-4">
            <p>
              A verdade é simples: o problema não é quanto você ganha, mas o quanto deixa escapar.
            </p>
            <p className="text-2xl font-semibold text-[#040509] italic">
              "Quem gasta tudo o que ganha, trabalha para os outros." — Arkad
            </p>
            <p>
              Com o UP Money, você aprende a pagar-se primeiro, organizar suas finanças e fazer o dinheiro trabalhar por você.
            </p>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="py-16 bg-gradient-to-br from-[#040509] to-[#2b3747] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              O MÉTODO 60/30/10 NA PRÁTICA
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A diferença está na ordem: primeiro você se paga, depois paga os outros e só então desfruta.
              Assim você sai do piloto automático e entra no controle total da sua vida financeira.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#dd9828]/20 to-[#dd9828]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#dd9828]/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#040509]">10%</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Eu do Futuro</h3>
                <p className="text-slate-300">
                  Reserva de emergência e investimentos para garantir seu futuro financeiro.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2b3747]/30 to-[#2b3747]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#dd9828]/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#2b3747] to-[#2b3747]/80 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#dd9828]/30">
                  <span className="text-2xl font-bold">60%</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Necessidades</h3>
                <p className="text-slate-300">
                  Despesas essenciais como moradia, alimentação, transporte e contas básicas.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#040509]/50 to-[#2b3747]/30 backdrop-blur-sm rounded-2xl p-8 border border-[#dd9828]/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#040509] to-[#2b3747] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#dd9828]/30">
                  <span className="text-2xl font-bold">30%</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Desejos</h3>
                <p className="text-slate-300">
                  Lazer, entretenimento, hobbies e tudo que traz prazer à sua vida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#040509] mb-6">
              MÉTODO MILENAR, COMPROVADO POR GERAÇÕES — E VALIDADO POR ESPECIALISTA
            </h2>
            <p className="text-xl text-[#2b3747] max-w-4xl mx-auto">
              Inspirado nos princípios de "O Homem Mais Rico da Babilônia" e reforçado por Thiago Nigro, 
              o método 60/30/10 ensina que riqueza não é sorte — é disciplina.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-slate-50 rounded-lg p-4 border border-[#dd9828]/10">
                <CheckCircle className="w-6 h-6 text-[#dd9828] flex-shrink-0" />
                <span className="text-[#2b3747] font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#040509] mb-6">
              TUDO O QUE VOCÊ PRECISA PARA SAIR DO ZERO A ZERO
            </h2>
            <p className="text-xl text-[#2b3747]">
              Ferramentas completas para transformar sua vida financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-[#dd9828]/10">
                <div className="text-[#dd9828] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#040509] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#2b3747]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#dd9828]/10 to-[#dd9828]/5 rounded-2xl p-8 border border-[#dd9828]/20 relative">
              <div className="flex justify-center mb-6">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/59ba1771-77ed-4d62-8023-2031b075eb82.png" 
                  alt="Ebooks sobre finanças" 
                  className="w-full max-w-md h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Gift className="w-6 h-6 text-[#dd9828]" />
                <span className="text-xl font-bold text-[#040509]">Bônus Exclusivo</span>
              </div>
              <p className="text-lg text-[#2b3747]">
                Ebooks — <em>Pai Rico Pai Pobre</em>, <em>O Homem Mais Rico da Babilônia</em>, 
                <em>Do Mil ao Milhão</em>, <em>Segredos da Mente Milionária</em> e mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#040509] mb-6">
              RESULTADOS REAIS DOS NOSSOS ALUNOS
            </h2>
            <p className="text-xl text-[#2b3747]">
              Veja como o UP Money transformou a vida financeira de alguns dos UPados(as)
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-[#dd9828]/10">
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-[#040509]">{testimonial.name}</h4>
                    <p className="text-[#2b3747] text-sm">{testimonial.profession}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#dd9828] fill-current" />
                  ))}
                </div>
                
                <p className="text-[#2b3747] italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mindset Section */}
      <section className="py-16 bg-gradient-to-br from-[#040509] to-[#2b3747] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              SUA MENTE É O PONTO DE PARTIDA
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              O UP Money vai além de números — ele reprograma sua mentalidade financeira.
              Porque quem muda o jeito de pensar, muda o jeito de viver.
            </p>
            <blockquote className="text-2xl font-semibold text-[#dd9828] italic">
              "Ou você controla o dinheiro, ou ele controla você."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section id="plans-section" className="py-16 bg-gradient-to-br from-[#dd9828]/10 to-[#dd9828]/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              ESCOLHA SEU PLANO
            </h2>
            <p className="text-xl text-white">
              Transforme sua vida financeira hoje mesmo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Mensal */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl p-8 shadow-2xl border-2 border-[#dd9828]/30 relative transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#040509] mb-4">Plano Mensal</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-[#040509]">
                    R$ 47
                    <span className="text-lg text-[#2b3747]">,90</span>
                  </div>
                  <div className="text-sm text-[#2b3747] mt-1">por mês</div>
                </div>
                
                <div className="mb-8">
                  <p className="text-[#2b3747] text-center">
                    Ideal para quem quer começar a transformação financeira com flexibilidade mensal.
                  </p>
                </div>

                <button 
                  onClick={() => handleCheckoutClick('monthly', 'UP Money - Plano Mensal')}
                  className="w-full bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-6 py-3 rounded-full font-bold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>COMEÇAR AGORA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Plano Semestral - DESTAQUE */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl p-8 shadow-2xl border-4 border-[#dd9828] relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-6 py-2 rounded-full text-sm font-bold">
                  MAIS POPULAR
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#040509] mb-4">Plano Semestral</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-[#040509]">
                    6x de R$ 18
                    <span className="text-lg text-[#2b3747]">,37</span>
                  </div>
                  <div className="text-sm text-[#2b3747] mt-1">ou R$ 97,90 à vista</div>
                  <div className="text-green-600 font-semibold text-sm mt-2">
                    Melhor custo-benefício no tempo!
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-[#2b3747] text-center">
                    Perfeito para quem quer resultados consistentes com economia significativa e tempo suficiente para consolidar os hábitos.
                  </p>
                </div>

                <button 
                  onClick={() => handleCheckoutClick('semester', 'UP Money - Plano Semestral')}
                  className="w-full bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-6 py-3 rounded-full font-bold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>QUERO ECONOMIZAR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Plano Anual */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl p-8 shadow-2xl border-2 border-[#dd9828]/30 relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-3 right-4">
                <div className="bg-[#dd9828] text-[#040509] px-3 py-1 rounded-full text-xs font-bold">
                  MELHOR VALOR
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#040509] mb-4">Plano Anual</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-[#040509]">
                    12x de R$ 15
                    <span className="text-lg text-[#2b3747]">,30</span>
                  </div>
                  <div className="text-sm text-[#2b3747] mt-1">ou R$ 147,90 à vista</div>
                  <div className="text-green-600 font-semibold text-sm mt-2">
                    Máxima economia no longo prazo!
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-[#2b3747] text-center">
                    Para quem está comprometido com a transformação completa e quer o melhor investimento no longo prazo.
                  </p>
                </div>

                <button 
                  onClick={() => handleCheckoutClick('annual', 'UP Money - Plano Anual')}
                  className="w-full bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-6 py-3 rounded-full font-bold hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>MÁXIMA ECONOMIA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Garantia */}
          <div className="text-center mt-12">
            <div className="flex justify-center mb-6">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bff1733f-c598-418e-b63d-c73d7fe259a3.png" 
                alt="Selo de Garantia de 7 Dias" 
                className="w-24 h-24"
              />
            </div>
            <div className="flex items-center justify-center space-x-2 text-white mb-4">
              <span className="text-lg font-semibold">Garantia de 7 dias ou seu dinheiro de volta</span>
            </div>
            <p className="text-white">
              Experimente sem riscos. Se não ficar satisfeito, devolvemos 100% do seu investimento.
            </p>
          </div>

          {/* Formas de Pagamento */}
          <div className="text-center mt-8">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/09343aa4-9757-4329-b62e-713a934dc79f.png" 
              alt="Formas de Pagamento" 
              className="mx-auto max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Offer Section with Timer */}
      <section className="py-16 bg-gradient-to-br from-[#040509] via-[#2b3747] to-[#040509] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              OFERTA ESPECIAL POR TEMPO LIMITADO
            </h2>
            <p className="text-xl text-slate-300">
              Apenas para os 100 primeiros alunos
            </p>

            <div className="bg-[#2b3747]/50 rounded-2xl p-6 backdrop-blur-sm border border-[#dd9828]/30">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="w-6 h-6 text-[#dd9828]" />
                <span className="text-xl font-bold">Oferta expira em:</span>
              </div>
              <div className="flex justify-center space-x-4 text-3xl font-bold">
                <div className="bg-[#dd9828] text-[#040509] rounded-lg px-4 py-2">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="flex items-center">:</div>
                <div className="bg-[#dd9828] text-[#040509] rounded-lg px-4 py-2">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="flex items-center">:</div>
                <div className="bg-[#dd9828] text-[#040509] rounded-lg px-4 py-2">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
              <div className="flex justify-center space-x-8 text-sm text-slate-300 mt-2">
                <span>HORAS</span>
                <span>MINUTOS</span>
                <span>SEGUNDOS</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-slate-300">
                Você investiria o valor de uma pizza no futuro da sua vida financeira?
              </p>
              <blockquote className="text-xl font-semibold text-[#dd9828] italic">
                "A melhor hora para ter começado foi há 20 anos. A segunda melhor é agora."
              </blockquote>
            </div>

            <button 
              onClick={scrollToPlans}
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-8 py-6 rounded-full font-bold text-xl hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-2xl hover:shadow-[#dd9828]/25 transform hover:scale-105"
            >
              <span>QUERO APLICAR O MÉTODO AGORA</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#040509] mb-6">
              PERGUNTAS FREQUENTES
            </h2>
            <p className="text-xl text-[#2b3747]">
              Tire suas dúvidas sobre o UP Money
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-[#dd9828]/20 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#dd9828]/5 transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-[#040509]">{faq.question}</span>
                  <div className={`transform transition-transform duration-200 ${openFaq === index ? 'rotate-45' : ''}`}>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-4 h-0.5 bg-[#dd9828]"></div>
                      <div className="w-0.5 h-4 bg-[#dd9828] absolute"></div>
                    </div>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[#2b3747]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#040509] via-[#2b3747] to-[#040509] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              MÉTODO 60/30/10 — DA BABILÔNIA AO SEU BOLSO
            </h2>
            <p className="text-xl text-slate-300">
              Pare de trabalhar para os outros. Comece a trabalhar para você mesmo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToPlans}
                className="bg-gradient-to-r from-[#dd9828] to-[#dd9828]/80 text-[#040509] px-8 py-4 rounded-full font-bold text-lg hover:from-[#dd9828]/90 hover:to-[#dd9828]/70 transition-all duration-300 shadow-2xl hover:shadow-[#dd9828]/25 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>COMEÇAR MINHA TRANSFORMAÇÃO</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-slate-400">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>+10.000 vidas transformadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Método validado</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>7 dias de garantia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#040509] text-white py-12 border-t border-[#dd9828]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26c35718-2d71-4663-94a3-23457b66070d.png" 
                alt="UP Money Logo" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-slate-400">
              Transformando vidas através da educação financeira.
            </p>
            <p className="text-slate-400">
              © 2025 UP Money. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}