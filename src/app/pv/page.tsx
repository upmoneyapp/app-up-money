"use client";

import { Check, Shield, BookOpen, TrendingUp, Users, Star, ChevronDown, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaginaVendas() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2d32] via-[#242F3C] to-[#2a2d32]">
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2a2d32]/95 backdrop-blur-sm border-b border-[#C28721]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#C28721] to-[#8B6914] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">UP</span>
            </div>
            <span className="text-white font-bold text-xl">MONEY</span>
          </button>
          
          <Button 
            onClick={() => scrollToSection("planos")}
            className="bg-gradient-to-r from-[#C28721] to-[#8B6914] hover:from-[#8B6914] hover:to-[#C28721] text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            VER PLANOS
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Desligue o Piloto Automático e Assuma o Controle da Sua Vida Financeira
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Recupere o domínio da sua renda com o método 60/30/10. Simples, visual e realista.
          </p>
          <Button 
            onClick={() => scrollToSection("planos")}
            className="bg-gradient-to-r from-[#C28721] to-[#8B6914] hover:from-[#8B6914] hover:to-[#C28721] text-white font-bold text-lg px-8 py-6 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-[#C28721]/50 hover:scale-105"
          >
            QUERO TRANSFORMAR MINHAS FINANÇAS AGORA
          </Button>
          
          <div className="mt-12 flex justify-center">
            <ChevronDown className="w-8 h-8 text-[#C28721] animate-bounce" />
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#242F3C] to-[#2a2d32]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
            Você Está Cansado de Viver no Vermelho?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-[#1a1d22] border-[#C28721]/30 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Sem Controle Real</h3>
                  <p className="text-gray-400">
                    Você sabe quanto ganha, mas não sabe para onde o dinheiro vai. No final do mês, sempre falta.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1a1d22] border-[#C28721]/30 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Planilhas Complicadas</h3>
                  <p className="text-gray-400">
                    Tentou usar planilhas, mas desistiu porque era muito trabalhoso e confuso.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1a1d22] border-[#C28721]/30 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Dívidas Crescentes</h3>
                  <p className="text-gray-400">
                    As dívidas só aumentam e você não consegue sair do ciclo de juros e parcelas.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1a1d22] border-[#C28721]/30 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Futuro Incerto</h3>
                  <p className="text-gray-400">
                    Não consegue poupar, investir ou planejar o futuro porque o presente já está apertado.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-[#C28721] mb-4">
              E se existisse uma forma SIMPLES de mudar isso?
            </p>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
            Conheça o Método 60/30/10
          </h2>
          
          <div className="bg-gradient-to-br from-[#C28721]/20 to-[#8B6914]/20 border border-[#C28721]/30 rounded-2xl p-8 md:p-12 mb-12">
            <p className="text-xl md:text-2xl text-gray-200 text-center mb-8">
              Um sistema visual e prático que divide sua renda em 3 categorias simples:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1a1d22] rounded-xl p-6 text-center">
                <div className="text-5xl font-bold text-[#C28721] mb-4">60%</div>
                <h3 className="text-xl font-bold text-white mb-2">Essenciais</h3>
                <p className="text-gray-400">Contas fixas, alimentação, transporte</p>
              </div>

              <div className="bg-[#1a1d22] rounded-xl p-6 text-center">
                <div className="text-5xl font-bold text-[#C28721] mb-4">30%</div>
                <h3 className="text-xl font-bold text-white mb-2">Estilo de Vida</h3>
                <p className="text-gray-400">Lazer, hobbies, pequenos prazeres</p>
              </div>

              <div className="bg-[#1a1d22] rounded-xl p-6 text-center">
                <div className="text-5xl font-bold text-[#C28721] mb-4">10%</div>
                <h3 className="text-xl font-bold text-white mb-2">Futuro</h3>
                <p className="text-gray-400">Investimentos, reserva de emergência</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-300 mb-8">
              Sem planilhas complicadas. Sem fórmulas confusas. Apenas um sistema visual que funciona.
            </p>
            <Button 
              onClick={() => scrollToSection("planos")}
              className="bg-gradient-to-r from-[#C28721] to-[#8B6914] hover:from-[#8B6914] hover:to-[#C28721] text-white font-bold text-lg px-8 py-6 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-[#C28721]/50 hover:scale-105"
            >
              QUERO COMEÇAR AGORA
            </Button>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#242F3C] to-[#2a2d32]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
            O Que Você Vai Conseguir
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <TrendingUp className="w-8 h-8" />, title: "Controle Total", desc: "Visualize exatamente para onde seu dinheiro está indo" },
              { icon: <Shield className="w-8 h-8" />, title: "Sem Surpresas", desc: "Nunca mais seja pego desprevenido no final do mês" },
              { icon: <BookOpen className="w-8 h-8" />, title: "Simples de Usar", desc: "Interface intuitiva que qualquer pessoa consegue usar" },
              { icon: <Users className="w-8 h-8" />, title: "Para Toda Família", desc: "Gerencie múltiplas contas e compartilhe com quem quiser" },
              { icon: <Star className="w-8 h-8" />, title: "Decisões Inteligentes", desc: "Saiba quando pode gastar e quando precisa economizar" },
              { icon: <Check className="w-8 h-8" />, title: "Resultados Reais", desc: "Veja seu patrimônio crescer mês após mês" },
            ].map((item, index) => (
              <Card key={index} className="bg-[#1a1d22] border-[#C28721]/30 p-6 hover:border-[#C28721] transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#C28721] to-[#8B6914] rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12">
            Transforme suas finanças com o método 60/30/10
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Mensal */}
            <Card className="bg-[#1a1d22] border-[#C28721]/30 p-8 hover:border-[#C28721] transition-all duration-300 hover:scale-105">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">PLANO MENSAL</h3>
                <p className="text-gray-400 mb-4 min-h-[48px]">Ideal para quem quer começar a transformação financeira com flexibilidade mensal</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[200px]">
                {[
                  "Método 60/30/10 completo",
                  "Controle de gastos visual",
                  "Relatórios mensais",
                  "Suporte por email",
                  "Atualizações gratuitas"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-[#C28721] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="https://pay.hotmart.com/J102711621S?off=c0c94yc8"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-gradient-to-r from-[#C28721] to-[#8B6914] hover:from-[#8B6914] hover:to-[#C28721] text-white font-bold py-3">
                  COMEÇAR AGORA
                </Button>
              </a>
            </Card>

            {/* Plano Semestral - DESTAQUE */}
            <Card className="bg-gradient-to-br from-[#C28721]/20 to-[#8B6914]/20 border-2 border-[#C28721] p-8 relative transform md:scale-110 shadow-2xl shadow-[#C28721]/30">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#C28721] to-[#8B6914] text-white px-4 py-1 rounded-full text-sm font-bold">
                MELHOR CUSTO-BENEFÍCIO
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">PLANO SEMESTRAL</h3>
                <p className="text-gray-300 mb-4 min-h-[48px]">Perfeito para quem quer resultados consistentes com economia significativa e tempo suficiente para consolidar os hábitos</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[200px]">
                {[
                  "Tudo do plano Mensal",
                  "Economia significativa",
                  "Relatórios avançados",
                  "Suporte prioritário",
                  "6 meses de acesso",
                  "Comunidade exclusiva"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-[#C28721] flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="https://pay.hotmart.com/J102711621S?off=hknpdaks"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-gradient-to-r from-[#C28721] to-[#8B6914] hover:from-[#8B6914] hover:to-[#C28721] text-white font-bold py-3 shadow-lg">
                  QUERO ECONOMIZAR
                </Button>
              </a>
            </Card>

            {/* Plano Anual */}
            <Card className="bg-[#1a1d22] border-[#C28721]/30 p-8 hover:border-[#C28721] transition-all duration-300 hover:scale-105">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">PLANO ANUAL</h3>
                <p className="text-gray-400 mb-4 min-h-[48px]">Para quem está comprometido com transformação completa e quer o melhor investimento no longo prazo</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[200px]">
                {[
                  "Tudo do plano Semestral",
                  "Máxima economia",
                  "12 meses de acesso",
                  "Relatórios personalizados",
                  "Suporte VIP 24/7",
                  "Consultoria mensal",
                  "Bônus exclusivos"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-[#C28721] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="https://pay.hotmart.com/J102711621S?off=dijt8g94"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-gradient-to-r from-[#C28721] to-[#8B6914] hover:from-[#8B6914] hover:to-[#C28721] text-white font-bold py-3">
                  MÁXIMA ECONOMIA
                </Button>
              </a>
            </Card>
          </div>

          {/* Formas de Pagamento */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Formas de Pagamento</h3>
            <div className="flex flex-wrap justify-center items-center gap-4 opacity-70">
              <span className="text-gray-400">💳 Cartão de Crédito</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">🏦 PIX</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">📄 Boleto</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">💰 Parcelamento em até 12x</span>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#242F3C] to-[#2a2d32]">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-[#C28721]/20 to-[#8B6914]/20 border-2 border-[#C28721] rounded-2xl p-8 md:p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-[#C28721] to-[#8B6914] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Garantia de 7 Dias
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Experimente o UP Money por 7 dias. Se não gostar, devolvemos 100% do seu dinheiro.
            </p>
            <p className="text-gray-400">
              Sem perguntas. Sem burocracia. Você não tem nada a perder.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "O UP Money funciona no celular?",
                a: "Sim! O UP Money é um aplicativo web responsivo que funciona perfeitamente em qualquer dispositivo - celular, tablet ou computador."
              },
              {
                q: "Preciso pagar mensalidade?",
                a: "Depende do plano escolhido. Temos opções mensais, semestrais e anuais para você escolher o que melhor se adapta ao seu momento."
              },
              {
                q: "É seguro colocar meus dados financeiros?",
                a: "Totalmente seguro! Utilizamos criptografia de ponta e não temos acesso às suas senhas bancárias. Você controla tudo manualmente."
              },
              {
                q: "Funciona para MEI e empresas?",
                a: "Sim! O UP Money pode ser usado tanto para finanças pessoais quanto para pequenos negócios e MEIs."
              },
              {
                q: "E se eu não gostar?",
                a: "Você tem 7 dias de garantia incondicional. Se não gostar, basta solicitar o reembolso e devolvemos 100% do valor pago."
              }
            ].map((item, index) => (
              <Card key={index} className="bg-[#1a1d22] border-[#C28721]/30 p-6">
                <h3 className="text-xl font-bold text-white mb-3">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#242F3C] to-[#2a2d32]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Está Pronto Para Transformar Suas Finanças?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de pessoas que já assumiram o controle do seu dinheiro
          </p>
          <Button 
            onClick={() => scrollToSection("planos")}
            className="bg-gradient-to-r from-[#C28721] to-[#8B6914] hover:from-[#8B6914] hover:to-[#C28721] text-white font-bold text-xl px-12 py-8 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-[#C28721]/50 hover:scale-105"
          >
            SIM, QUERO COMEÇAR AGORA!
          </Button>
          
          <p className="text-sm text-gray-500 mt-6">
            Pagamento seguro • Garantia de 7 dias • Acesso imediato
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#C28721]/20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C28721] to-[#8B6914] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">UP</span>
            </div>
            <span className="text-white font-bold text-xl">MONEY</span>
          </div>
          
          <p className="text-gray-400 mb-4">
            Transformando vidas através da educação financeira
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#C28721] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#C28721] transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-[#C28721] transition-colors">Contato</a>
          </div>
          
          <p className="text-gray-600 text-sm mt-6">
            © 2024 UP Money. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
