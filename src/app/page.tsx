'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  PieChart, 
  Scissors, 
  Wallet, 
  Calculator, 
  BookOpen,
  Sun,
  Moon,
  Edit3,
  DollarSign,
  Minus,
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp as TrendingUpIcon,
  LogOut,
  Trash2,
  Menu,
  Target,
  Calendar,
  Trophy,
  Eye,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { supabase } from '@/lib/supabase';
import { 
  formatCurrency, 
  calculateMethod60_30_10, 
  generateId, 
  calculateCompoundInterest,
  getMonthName,
  isSameDay
} from '@/lib/utils';
import type { 
  BudgetItem, 
  Cut, 
  Expense, 
  PatrimonyEntry, 
  AnnualBalance, 
  CompoundInterestResult,
  Book,
  EducationalContent
} from '@/lib/types';

type ActiveSection = 'dashboard' | 'budget' | 'cuts' | 'patrimony' | 'annual' | 'calculator' | 'library' | 'objectives';

interface Objective {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  target_date: string;
  current_value: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ObjectiveContribution {
  id: string;
  objective_id: string;
  user_id: string;
  amount: number;
  contribution_date: string;
  created_at: string;
}

export default function UpMoneyApp() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState('0');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Estados para cada seção
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [patrimonyEntries, setPatrimonyEntries] = useState<PatrimonyEntry[]>([]);
  const [annualBalances, setAnnualBalances] = useState<AnnualBalance[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [contributions, setContributions] = useState<ObjectiveContribution[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Estados para formulários
  const [newBudgetItem, setNewBudgetItem] = useState({ description: '', category: 'essential' as const, value: '' });
  const [newCut, setNewCut] = useState({ description: '', value: '', category: 'nonessential' as const });
  const [newExpense, setNewExpense] = useState({ description: '', value: '', date: '' });
  const [newPatrimony, setNewPatrimony] = useState({ period: '', bank: '', brokerage: '', assets: '' });
  const [newBalance, setNewBalance] = useState({ period: '', earned: '', spent: '' });
  const [newObjective, setNewObjective] = useState({ title: '', target_value: '', target_date: '' });
  const [contributionAmounts, setContributionAmounts] = useState<{[key: string]: string}>({});

  // Estados para calculadora
  const [calcValues, setCalcValues] = useState({
    initialValue: '',
    monthlyContribution: '',
    annualRate: '',
    years: ''
  });
  const [calcResults, setCalcResults] = useState<CompoundInterestResult[]>([]);

  // Verificar sessão do usuário
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Carregar dados do usuário quando logado
  useEffect(() => {
    if (session?.user) {
      loadUserData();
    }
  }, [session]);

  // Calcular juros compostos quando valores mudam
  useEffect(() => {
    if (calcValues.initialValue && calcValues.monthlyContribution && calcValues.annualRate && calcValues.years) {
      const results = calculateCompoundInterest(
        Number(calcValues.initialValue),
        Number(calcValues.monthlyContribution),
        Number(calcValues.annualRate),
        Number(calcValues.years)
      );
      setCalcResults(results);
    } else {
      setCalcResults([]);
    }
  }, [calcValues]);

  const loadUserData = async () => {
    if (!session?.user) return;

    try {
      // Carregar renda mensal
      const { data: userData, error: userError } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (userData && !userError) {
        const income = userData.monthly_income || 0;
        setMonthlyIncome(income);
        setTempIncome(income.toString());
      } else if (userError && userError.code === 'PGRST116') {
        // Registro não existe, criar com valor 0
        await saveUserData(0);
        setMonthlyIncome(0);
        setTempIncome('0');
      }

      // Carregar itens do orçamento
      const { data: budgetData } = await supabase
        .from('budget_items')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (budgetData) {
        setBudgetItems(budgetData);
      }

      // Carregar cortes
      const { data: cutsData } = await supabase
        .from('cuts')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (cutsData) {
        setCuts(cutsData);
      }

      // Carregar patrimônio
      const { data: patrimonyData } = await supabase
        .from('patrimony_entries')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (patrimonyData) {
        setPatrimonyEntries(patrimonyData);
      }

      // Carregar balanços anuais
      const { data: balancesData } = await supabase
        .from('annual_balances')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (balancesData) {
        setAnnualBalances(balancesData);
      }

      // Carregar objetivos
      const { data: objectivesData } = await supabase
        .from('objectives')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (objectivesData) {
        setObjectives(objectivesData);
      }

      // Carregar contribuições
      const { data: contributionsData } = await supabase
        .from('objective_contributions')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (contributionsData) {
        setContributions(contributionsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const saveUserData = async (income: number) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: session.user.id,
          monthly_income: income,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar renda:', error);
    }
  };

  const method = calculateMethod60_30_10(monthlyIncome);

  const handleIncomeEdit = async () => {
    const value = Number(tempIncome);
    if (value >= 0) {
      setMonthlyIncome(value);
      await saveUserData(value);
    }
    setIsEditingIncome(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const addBudgetItem = async () => {
    if (!session?.user || !newBudgetItem.description || !newBudgetItem.value) return;

    try {
      const item = {
        user_id: session.user.id,
        description: newBudgetItem.description,
        category: newBudgetItem.category,
        value: Number(newBudgetItem.value)
      };

      const { data, error } = await supabase
        .from('budget_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;

      setBudgetItems([...budgetItems, data]);
      setNewBudgetItem({ description: '', category: 'essential', value: '' });
    } catch (error) {
      console.error('Erro ao adicionar item do orçamento:', error);
    }
  };

  const deleteBudgetItem = async (id: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setBudgetItems(budgetItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao excluir item do orçamento:', error);
    }
  };

  const addCut = async () => {
    if (!session?.user || !newCut.description || !newCut.value) return;

    try {
      const cut = {
        user_id: session.user.id,
        description: newCut.description,
        value: Number(newCut.value),
        category: newCut.category
      };

      const { data, error } = await supabase
        .from('cuts')
        .insert(cut)
        .select()
        .single();

      if (error) throw error;

      setCuts([...cuts, data]);
      setNewCut({ description: '', value: '', category: 'nonessential' });
    } catch (error) {
      console.error('Erro ao adicionar corte:', error);
    }
  };

  const deleteCut = async (id: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('cuts')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setCuts(cuts.filter(cut => cut.id !== id));
    } catch (error) {
      console.error('Erro ao excluir corte:', error);
    }
  };

  const addPatrimony = async () => {
    if (!session?.user || !newPatrimony.period || !newPatrimony.bank || !newPatrimony.brokerage || !newPatrimony.assets) return;

    try {
      const total = Number(newPatrimony.bank) + Number(newPatrimony.brokerage) + Number(newPatrimony.assets);
      const entry = {
        user_id: session.user.id,
        period: newPatrimony.period,
        bank: Number(newPatrimony.bank),
        brokerage: Number(newPatrimony.brokerage),
        assets: Number(newPatrimony.assets),
        total
      };

      const { data, error } = await supabase
        .from('patrimony_entries')
        .insert(entry)
        .select()
        .single();

      if (error) throw error;

      setPatrimonyEntries([...patrimonyEntries, data]);
      setNewPatrimony({ period: '', bank: '', brokerage: '', assets: '' });
    } catch (error) {
      console.error('Erro ao adicionar patrimônio:', error);
    }
  };

  const deletePatrimony = async (id: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('patrimony_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setPatrimonyEntries(patrimonyEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Erro ao excluir patrimônio:', error);
    }
  };

  const addBalance = async () => {
    if (!session?.user || !newBalance.period || !newBalance.earned || !newBalance.spent) return;

    try {
      const balance = Number(newBalance.earned) - Number(newBalance.spent);
      const entry = {
        user_id: session.user.id,
        period: newBalance.period,
        earned: Number(newBalance.earned),
        spent: Number(newBalance.spent),
        balance
      };

      const { data, error } = await supabase
        .from('annual_balances')
        .insert(entry)
        .select()
        .single();

      if (error) throw error;

      setAnnualBalances([...annualBalances, data]);
      setNewBalance({ period: '', earned: '', spent: '' });
    } catch (error) {
      console.error('Erro ao adicionar balanço:', error);
    }
  };

  const deleteBalance = async (id: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('annual_balances')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setAnnualBalances(annualBalances.filter(balance => balance.id !== id));
    } catch (error) {
      console.error('Erro ao excluir balanço:', error);
    }
  };

  // Funções para objetivos
  const addObjective = async () => {
    if (!session?.user || !newObjective.title || !newObjective.target_value || !newObjective.target_date) return;

    try {
      const objective = {
        user_id: session.user.id,
        title: newObjective.title,
        target_value: Number(newObjective.target_value),
        target_date: newObjective.target_date,
        current_value: 0,
        completed: false
      };

      const { data, error } = await supabase
        .from('objectives')
        .insert(objective)
        .select()
        .single();

      if (error) throw error;

      setObjectives([data, ...objectives]);
      setNewObjective({ title: '', target_value: '', target_date: '' });
    } catch (error) {
      console.error('Erro ao adicionar objetivo:', error);
    }
  };

  const addContribution = async (objectiveId: string) => {
    if (!session?.user || !contributionAmounts[objectiveId]) return;

    try {
      const contribution = {
        objective_id: objectiveId,
        user_id: session.user.id,
        amount: Number(contributionAmounts[objectiveId]),
        contribution_date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('objective_contributions')
        .insert(contribution)
        .select()
        .single();

      if (error) throw error;

      setContributions([...contributions, data]);

      // Atualizar valor atual do objetivo
      const objective = objectives.find(obj => obj.id === objectiveId);
      if (objective) {
        const newCurrentValue = objective.current_value + Number(contributionAmounts[objectiveId]);
        const completed = newCurrentValue >= objective.target_value;

        await supabase
          .from('objectives')
          .update({ 
            current_value: newCurrentValue,
            completed: completed,
            updated_at: new Date().toISOString()
          })
          .eq('id', objectiveId);

        setObjectives(objectives.map(obj => 
          obj.id === objectiveId 
            ? { ...obj, current_value: newCurrentValue, completed }
            : obj
        ));
      }

      setContributionAmounts({ ...contributionAmounts, [objectiveId]: '' });
    } catch (error) {
      console.error('Erro ao adicionar contribuição:', error);
    }
  };

  const toggleObjectiveComplete = async (objectiveId: string) => {
    if (!session?.user) return;

    try {
      const objective = objectives.find(obj => obj.id === objectiveId);
      if (!objective) return;

      const newCompleted = !objective.completed;
      
      await supabase
        .from('objectives')
        .update({ 
          completed: newCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', objectiveId);

      setObjectives(objectives.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, completed: newCompleted }
          : obj
      ));
    } catch (error) {
      console.error('Erro ao atualizar objetivo:', error);
    }
  };

  const deleteObjective = async (id: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('objectives')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setObjectives(objectives.filter(obj => obj.id !== id));
      setContributions(contributions.filter(contrib => contrib.objective_id !== id));
    } catch (error) {
      console.error('Erro ao excluir objetivo:', error);
    }
  };

  // Se ainda está carregando
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e7a034] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  };

  // Se não está logado, mostrar landing page
  if (!session) {
    return (
      <div className="min-h-screen bg-white">
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
                const loginSection = document.getElementById('login-section');
                if (loginSection) {
                  loginSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3 py-1.5 text-xs sm:text-sm bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Já Comprei
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-[#263240] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              DESLIGUE O PILOTO AUTOMÁTICO E ASSUMA O CONTROLE DA SUA VIDA FINANCEIRA ATRAVÉS DO MÉTODO 60-30-10
            </h1>
          </div>
        </section>

        {/* Imagem do Celular */}
        <section className="bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/ebb49626-2c17-481a-b464-52da34536589.png" 
              alt="Aplicativo UP Money em smartphone" 
              className="w-full max-w-md mx-auto h-auto"
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
        <section className="bg-[#263240] py-16 px-4 sm:px-6 lg:px-8">
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
        <section className="bg-[#F2F5FA] py-16 px-4 sm:px-6 lg:px-8">
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
        <section className="bg-[#F2F5FA] py-8 px-4 sm:px-6 lg:px-8">
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
                  <p className="text-gray-700">Você vai aprender como montar uma Reserva de Emergência do zero — e finalmente sentir a segurança de ter o controle do seu dinheiro.</p>
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
          </div>
        </section>

        {/* CTA - Quero Aprender o Método Milenar */}
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
              QUERO APRENDER O MÉTODO MILENAR
            </button>
          </div>
        </section>

        {/* Provas Sociais */}
        <section className="bg-[#263240] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12 text-center">
              O QUE NOSSOS USUÁRIOS ESTÃO DIZENDO:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Depoimento 1 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e7a034] to-[#d4941f] flex items-center justify-center text-white font-bold text-lg">
                    C
                  </div>
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

              {/* Depoimento 2 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e7a034] to-[#d4941f] flex items-center justify-center text-white font-bold text-lg">
                    P
                  </div>
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

              {/* Depoimento 3 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e7a034] to-[#d4941f] flex items-center justify-center text-white font-bold text-lg">
                    F
                  </div>
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
        <section id="plans-section" className="bg-[#2a2d32] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12 text-center">
              ESCOLHA SEU PLANO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Plano Mensal */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mensal</h3>
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
                  COMEÇAR MINHA TRANSFORMAÇÃO
                </a>
              </div>

              {/* Plano Semestral */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-[#e7a034] relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#e7a034] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MAIS POPULAR
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Semestral</h3>
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
                  COMEÇAR MINHA TRANSFORMAÇÃO
                </a>
              </div>

              {/* Plano Anual */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Anual</h3>
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
                  COMEÇAR MINHA TRANSFORMAÇÃO
                </a>
              </div>
            </div>

            {/* Garantia e Pagamento Seguro */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white mb-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🛡️</div>
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
                    <h3 className="font-semibold text-gray-900">P: {faq.question}</h3>
                    <ChevronDown 
                      className={`text-gray-600 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">R: {faq.answer}</p>
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

        {/* Seção de Login */}
        <section id="login-section" className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Acesso ao APP UP MONEY
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Faça login para acessar o aplicativo completo
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full py-3 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white text-center font-semibold rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#263240] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center text-white">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png" 
              alt="UP Money Logo" 
              className="h-8 w-auto mx-auto mb-4"
            />
            <p className="text-sm text-gray-300">
              © 2024 UP Money. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  const books: Book[] = [
    {
      id: '1',
      title: 'Pai Rico, Pai Pobre',
      author: 'Robert Kiyosaki',
      summary: 'Lições sobre dinheiro e investimentos que não aprendemos na escola.',
      cover: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2c25ce1e-adbc-4c81-9122-31b1e978d01c.jpg'
    },
    {
      id: '2',
      title: 'O Homem mais Rico da Babilônia',
      author: 'George S. Clason',
      summary: 'Princípios atemporais para construir riqueza e prosperidade.',
      cover: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/ea40e00a-f567-4b49-a594-e5c171c60ceb.jpg'
    },
    {
      id: '3',
      title: 'Segredos da Mente Milionária',
      author: 'T. Harv Eker',
      summary: 'Como reprogramar sua mente para o sucesso financeiro.',
      cover: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/94da8c91-31fb-4df8-813f-405d35c20758.jpg'
    },
    {
      id: '4',
      title: 'Quem Pensa, Enriquece',
      author: 'Napoleon Hill',
      summary: 'O poder do pensamento positivo na construção da riqueza.',
      cover: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/12a57d78-51c0-4a69-9cda-cadc07867e0e.jpg'
    },
    {
      id: '5',
      title: 'Do Mil ao Milhão',
      author: 'Thiago Nigro',
      summary: 'Estratégias práticas para multiplicar seu patrimônio.',
      cover: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/af0cdb9e-8113-49f2-8443-fd25c27f292e.jpg'
    }
  ];

  const educationalContent: EducationalContent[] = [
    {
      id: '1',
      title: 'Nunca gaste mais do que ganhe',
      content: 'A regra de ouro das finanças pessoais. Viver dentro das suas possibilidades é o primeiro passo para a liberdade financeira.',
      category: 'Básico'
    },
    {
      id: '2',
      title: 'Reserva de Emergência',
      content: 'Mantenha de 6 a 12 meses de gastos guardados para imprevistos. É sua rede de segurança financeira.',
      category: 'Planejamento'
    },
    {
      id: '3',
      title: 'Taxa SELIC',
      content: 'A taxa básica de juros da economia brasileira. Influencia todos os investimentos e financiamentos do país.',
      category: 'Investimentos'
    },
    {
      id: '4',
      title: 'Juros Compostos',
      content: 'O efeito bola de neve do dinheiro. Seus rendimentos geram novos rendimentos, multiplicando seu patrimônio ao longo do tempo.',
      category: 'Investimentos'
    },
    {
      id: '5',
      title: 'Renda Ativa vs Passiva',
      content: 'Renda ativa vem do seu trabalho. Renda passiva vem dos seus investimentos. O objetivo é aumentar a passiva.',
      category: 'Conceitos'
    }
  ];

  const renderDashboard = () => {
    const totalPatrimony = patrimonyEntries.length > 0 ? patrimonyEntries[patrimonyEntries.length - 1].total : 0;
    const totalCuts = cuts.reduce((sum, cut) => sum + cut.value, 0);
    const totalObjectives = objectives.length;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Painel de Controle
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Visão geral do método 60/30/10
          </p>
        </div>

        {/* Renda Mensal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Renda Mensal
            </h2>
            <button
              onClick={() => {
                setIsEditingIncome(true);
                setTempIncome(monthlyIncome.toString());
              }}
              className="p-2 text-[#e7a034] hover:bg-[#e7a034]/10 rounded-lg transition-colors"
            >
              <Edit3 size={20} />
            </button>
          </div>
          
          {isEditingIncome ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                value={tempIncome}
                onChange={(e) => setTempIncome(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Digite sua renda mensal"
              />
              <div className="flex gap-2 sm:flex-shrink-0">
                <button
                  onClick={handleIncomeEdit}
                  className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex-shrink-0"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setIsEditingIncome(false)}
                  className="px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-[#e7a034]">
              {formatCurrency(monthlyIncome)}
            </div>
          )}
        </div>

        {/* Método 60/30/10 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#dd9828] to-[#b8801f] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Reserva de Emergência</h3>
                <p className="text-sm opacity-90">10% - Pague-se primeiro</p>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(method.emergency)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#040509] to-[#1a1a1a] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Despesas Essenciais</h3>
                <p className="text-sm opacity-90">60% - Contas indispensáveis</p>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(method.essential)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2b3747] to-[#1e2832] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Despesas Não Obrigatórias</h3>
                <p className="text-sm opacity-90">30% - Desfrute com sabedoria</p>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(method.nonessential)}
            </div>
          </div>
        </div>

        {/* Barra de Progresso do Método 60/30/10 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição do Método 60/30/10
          </h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <div className="w-full max-w-2xl overflow-x-auto">
              <div className="flex rounded-2xl border-2 border-white overflow-hidden shadow-lg min-w-[500px] md:min-w-[400px]">
                <div className="flex-[60] bg-[#1a1a1a] text-white p-3 sm:p-4 md:p-6 flex items-center justify-center min-w-0">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <DollarSign size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="font-bold text-sm sm:text-base md:text-lg">60%</span>
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-tight">Necessidades</div>
                    <div className="text-xs opacity-80 mt-1">{formatCurrency(method.essential)}</div>
                  </div>
                </div>
                
                <div className="flex-[30] bg-[#6c757d] text-white p-3 sm:p-4 md:p-6 flex items-center justify-center border-l-2 border-white min-w-0">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <TrendingUp size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="font-bold text-sm sm:text-base md:text-lg">30%</span>
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-tight">Desejos</div>
                    <div className="text-xs opacity-80 mt-1">{formatCurrency(method.nonessential)}</div>
                  </div>
                </div>
                
                <div className="flex-[10] bg-white text-[#e7a034] p-2 sm:p-3 md:p-6 flex items-center justify-center border-l-2 border-white min-w-[80px] sm:min-w-[100px]">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1 sm:mb-2">
                      <Wallet size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="font-bold text-sm sm:text-base md:text-lg">10%</span>
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-tight whitespace-nowrap">Eu do Futuro</div>
                    <div className="text-xs opacity-80 mt-1">{formatCurrency(method.emergency)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveSection('patrimony')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#e7a034]/10 rounded-lg">
                <TrendingUp className="text-[#e7a034]" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Patrimônio</h3>
            </div>
            <div className="text-2xl font-bold text-[#e7a034] mb-2">
              {formatCurrency(totalPatrimony)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Acompanhe a evolução da sua riqueza
            </p>
          </button>

          <button
            onClick={() => setActiveSection('cuts')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-700/10 rounded-lg">
                <Scissors className="text-gray-700" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Quadro de Cortes</h3>
            </div>
            <div className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              {formatCurrency(totalCuts)}/mês
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Economia anual: {formatCurrency(totalCuts * 12)}
            </p>
          </button>

          <button
            onClick={() => setActiveSection('objectives')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="text-blue-500" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Objetivos</h3>
            </div>
            <div className="text-2xl font-bold text-blue-500 mb-2">
              {totalObjectives}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Metas para serem batidas
            </p>
          </button>
        </div>
      </div>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Painel de Controle', icon: BarChart3 },
    { id: 'budget', label: 'Orçamento', icon: PieChart },
    { id: 'cuts', label: 'Quadro de Cortes', icon: Scissors },
    { id: 'patrimony', label: 'Patrimônio', icon: Wallet },
    { id: 'annual', label: 'Ganho Líquido', icon: TrendingUpIcon },
    { id: 'objectives', label: 'Objetivos', icon: Target },
    { id: 'calculator', label: 'Simulador de Juros', icon: Calculator },
    { id: 'library', label: 'Biblioteca', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors touch-pan-x touch-pan-y" style={{ touchAction: 'pan-x pan-y' }}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>

            <button
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
            >
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png" 
                alt="UP Money Logo" 
                className="h-10 w-auto"
              />
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <img 
                      src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20f72b47-6a9a-490d-8e4c-72b4bf5d8000.png" 
                      alt="UP Money Logo" 
                      className="h-8 w-auto"
                    />
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id as ActiveSection);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeSection === item.id
                              ? 'bg-[#e7a034]/10 text-[#e7a034]'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sair do App</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          <div className="hidden lg:block lg:w-64">
            <nav className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as ActiveSection)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-[#e7a034]/10 text-[#e7a034]'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
