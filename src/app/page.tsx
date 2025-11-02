'use client';

import { useState, useEffect } from 'react';
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
  Trophy
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
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
  const { theme, toggleTheme } = useTheme();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState('5000');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  }, []);

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
      const { data: userData } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (userData) {
        setMonthlyIncome(userData.monthly_income);
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
    if (value > 0) {
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

  // Se não está logado, mostrar tela de login
  if (!session) {
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
              Bem-vindo ao UP Money
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Desligue o piloto automático e assuma o controle da sua vida financeira.
            </p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#e7a034',
                    brandAccent: '#d4941f',
                  },
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Insira seu e-mail',
                  password_label: 'Sua senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  link_text: 'Já tem uma conta? Entre aqui',
                },
                sign_up: {
                  email_label: 'Insira seu e-mail',
                  password_label: 'Sua senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
                forgotten_password: {
                  link_text: 'Esqueceu sua senha?',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando...',
                },
              },
            }}
          />
        </div>
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
    // Calcular resumos dos outros menus
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
            {/* Barra de Progresso */}
            <div className="w-full max-w-2xl overflow-x-auto">
              <div className="flex rounded-2xl border-2 border-white overflow-hidden shadow-lg min-w-[500px] md:min-w-[400px]">
                {/* 60% Necessidades */}
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
                
                {/* 30% Desejos */}
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
                
                {/* 10% Eu do Futuro */}
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

  const renderObjectives = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Objetivos
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Defina suas metas e acompanhe seu progresso
          </p>
        </div>

        {/* Formulário para Novo Objetivo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Criar Novo Objetivo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Objetivo que quer alcançar"
              value={newObjective.title}
              onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Valor"
              value={newObjective.target_value}
              onChange={(e) => setNewObjective({...newObjective, target_value: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="date"
              value={newObjective.target_date}
              onChange={(e) => setNewObjective({...newObjective, target_date: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={addObjective}
              className="px-6 py-2 bg-[#e7a034] text-white rounded-lg hover:bg-[#d4941f] transition-colors md:col-span-1"
            >
              <span className="block md:hidden">Adicionar</span>
              <span className="hidden md:block">Criar Objetivo</span>
            </button>
          </div>
        </div>

        {/* Lista de Objetivos */}
        <div className="space-y-4">
          {objectives.map((objective) => {
            const progress = objective.target_value > 0 ? (objective.current_value / objective.target_value) * 100 : 0;
            const isCompleted = objective.completed || progress >= 100;
            const objectiveContributions = contributions.filter(c => c.objective_id === objective.id);
            
            return (
              <div key={objective.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                        {objective.title}
                      </h3>
                      {isCompleted && <Trophy className="text-green-500" size={20} />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Meta: {formatCurrency(objective.target_value)}</span>
                      <span>Prazo: {new Date(objective.target_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleObjectiveComplete(objective.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => deleteObjective(objective.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progresso: {formatCurrency(objective.current_value)}</span>
                    <span>{Math.min(progress, 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-[#e7a034]'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Adicionar Contribuição */}
                {!isCompleted && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      placeholder="Valor mensal"
                      value={contributionAmounts[objective.id] || ''}
                      onChange={(e) => setContributionAmounts({
                        ...contributionAmounts,
                        [objective.id]: e.target.value
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={() => addContribution(objective.id)}
                      className="px-3 py-2 bg-gradient-to-r from-[#e7a034] to-[#d4941f] text-white rounded-lg hover:from-[#d4941f] hover:to-[#b8801f] transition-all text-sm whitespace-nowrap sm:w-auto w-full"
                    >
                      Adicionar
                    </button>
                  </div>
                )}

                {/* Histórico de Contribuições */}
                {objectiveContributions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Histórico de Contribuições
                    </h4>
                    <div className="space-y-1">
                      {objectiveContributions.slice(-3).map((contribution) => (
                        <div key={contribution.id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>{new Date(contribution.contribution_date).toLocaleDateString('pt-BR')}</span>
                          <span>{formatCurrency(contribution.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {objectives.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum objetivo criado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Crie seu primeiro objetivo para começar a acompanhar seu progresso.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBudget = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          💸 Controle de Orçamento
        </h2>
      </div>

      {/* Formulário */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Anote seu Orçamento Mensal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={newBudgetItem.description}
            onChange={(e) => setNewBudgetItem({...newBudgetItem, description: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            value={newBudgetItem.category}
            onChange={(e) => setNewBudgetItem({...newBudgetItem, category: e.target.value as any})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="emergency">Reserva de Emergência</option>
            <option value="essential">Despesas Essenciais</option>
            <option value="nonessential">Despesas Não Obrigatórias</option>
          </select>
          <input
            type="number"
            placeholder="Valor"
            value={newBudgetItem.value}
            onChange={(e) => setNewBudgetItem({...newBudgetItem, value: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={addBudgetItem}
            className="px-6 py-2 bg-[#e7a034] text-white rounded-lg hover:bg-[#d4941f] transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Itens do Orçamento
        </h3>
        <div className="space-y-3">
          {budgetItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{item.description}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.category === 'emergency' && 'Reserva de Emergência'}
                  {item.category === 'essential' && 'Despesas Essenciais'}
                  {item.category === 'nonessential' && 'Despesas Não Obrigatórias'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.value)}
                </div>
                <button
                  onClick={() => deleteBudgetItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Distribuição com Setores e Legenda */}
      {budgetItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição do Orçamento
          </h3>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {(() => {
                  const emergency = budgetItems.filter(item => item.category === 'emergency').reduce((sum, item) => sum + item.value, 0);
                  const essential = budgetItems.filter(item => item.category === 'essential').reduce((sum, item) => sum + item.value, 0);
                  const nonessential = budgetItems.filter(item => item.category === 'nonessential').reduce((sum, item) => sum + item.value, 0);
                  const total = emergency + essential + nonessential;
                  
                  if (total === 0) return null;
                  
                  const emergencyPercent = (emergency / total) * 100;
                  const essentialPercent = (essential / total) * 100;
                  const nonessentialPercent = (nonessential / total) * 100;
                  
                  const emergencyAngle = (emergency / total) * 360;
                  const essentialAngle = (essential / total) * 360;
                  const nonessentialAngle = (nonessential / total) * 360;
                  
                  let currentAngle = 0;
                  const paths = [];
                  
                  if (emergency > 0) {
                    const endAngle = currentAngle + emergencyAngle;
                    const x1 = 100 + 50 * Math.cos((currentAngle * Math.PI) / 180);
                    const y1 = 100 + 50 * Math.sin((currentAngle * Math.PI) / 180);
                    const x2 = 100 + 50 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 100 + 50 * Math.sin((endAngle * Math.PI) / 180);
                    const largeArc = emergencyAngle > 180 ? 1 : 0;
                    
                    const midAngle = (currentAngle + endAngle) / 2;
                    const textX = 100 + 30 * Math.cos((midAngle * Math.PI) / 180);
                    const textY = 100 + 30 * Math.sin((midAngle * Math.PI) / 180);
                    
                    paths.push(
                      <g key="emergency">
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill="#e7a034"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text x={textX} y={textY} textAnchor="middle" className="text-xs fill-white font-semibold">
                          {Math.round(emergencyPercent)}%
                        </text>
                      </g>
                    );
                    currentAngle = endAngle;
                  }
                  
                  if (essential > 0) {
                    const endAngle = currentAngle + essentialAngle;
                    const x1 = 100 + 50 * Math.cos((currentAngle * Math.PI) / 180);
                    const y1 = 100 + 50 * Math.sin((currentAngle * Math.PI) / 180);
                    const x2 = 100 + 50 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 100 + 50 * Math.sin((endAngle * Math.PI) / 180);
                    const largeArc = essentialAngle > 180 ? 1 : 0;
                    
                    const midAngle = (currentAngle + endAngle) / 2;
                    const textX = 100 + 30 * Math.cos((midAngle * Math.PI) / 180);
                    const textY = 100 + 30 * Math.sin((midAngle * Math.PI) / 180);
                    
                    paths.push(
                      <g key="essential">
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill="#000000"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text x={textX} y={textY} textAnchor="middle" className="text-xs fill-white font-semibold">
                          {Math.round(essentialPercent)}%
                        </text>
                      </g>
                    );
                    currentAngle = endAngle;
                  }
                  
                  if (nonessential > 0) {
                    const endAngle = currentAngle + nonessentialAngle;
                    const x1 = 100 + 50 * Math.cos((currentAngle * Math.PI) / 180);
                    const y1 = 100 + 50 * Math.sin((currentAngle * Math.PI) / 180);
                    const x2 = 100 + 50 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 100 + 50 * Math.sin((endAngle * Math.PI) / 180);
                    const largeArc = nonessentialAngle > 180 ? 1 : 0;
                    
                    const midAngle = (currentAngle + endAngle) / 2;
                    const textX = 100 + 30 * Math.cos((midAngle * Math.PI) / 180);
                    const textY = 100 + 30 * Math.sin((midAngle * Math.PI) / 180);
                    
                    paths.push(
                      <g key="nonessential">
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill="#6b7280"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text x={textX} y={textY} textAnchor="middle" className="text-xs fill-white font-semibold">
                          {Math.round(nonessentialPercent)}%
                        </text>
                      </g>
                    );
                  }
                  
                  return paths;
                })()}
              </svg>
            </div>
            
            <div className="flex flex-col gap-3">
              {['emergency', 'essential', 'nonessential'].map((category) => {
                const items = budgetItems.filter(item => item.category === category);
                const total = items.reduce((sum, item) => sum + item.value, 0);
                const percentage = budgetItems.length > 0 ? (total / budgetItems.reduce((sum, item) => sum + item.value, 0)) * 100 : 0;
                
                if (total === 0) return null;
                
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${
                      category === 'emergency' ? 'bg-[#e7a034]' :
                      category === 'essential' ? 'bg-black' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[120px]">
                      {category === 'emergency' && 'Reserva'}
                      {category === 'essential' && 'Essencial'}
                      {category === 'nonessential' && 'Não Obrigatório'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center mt-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(budgetItems.reduce((sum, item) => sum + item.value, 0))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Preenchido
            </div>
          </div>
        </div>
      )}

      {/* Frase Motivacional */}
      <div className="bg-gradient-to-r from-[#e7a034]/10 to-[#e7a034]/5 rounded-2xl p-6 text-center">
        <p className="text-lg font-medium text-[#e7a034]">
          💡 "Pague a si mesmo primeiro, honre seus compromissos e só então permita-se desfrutar."
        </p>
      </div>
    </div>
  );

  const renderCuts = () => {
    const totalCuts = cuts.reduce((sum, cut) => sum + cut.value, 0);
    const annualSavings = totalCuts * 12;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ✂️ Quadro de Cortes
          </h2>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Registrar Novo Corte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Descrição do corte"
              value={newCut.description}
              onChange={(e) => setNewCut({...newCut, description: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Valor mensal"
              value={newCut.value}
              onChange={(e) => setNewCut({...newCut, value: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={newCut.category}
              onChange={(e) => setNewCut({...newCut, category: e.target.value as any})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="essential">Despesa Essencial</option>
              <option value="nonessential">Despesa Não Obrigatória</option>
            </select>
            <button
              onClick={addCut}
              className="px-6 py-2 bg-[#e7a034] text-white rounded-lg hover:bg-[#d4941f] transition-colors"
            >
              Adicionar Corte
            </button>
          </div>
        </div>

        {/* Resumo de Economias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#e7a034] to-[#d4941f] rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">Economia Mensal</h3>
            <div className="text-2xl font-bold">{formatCurrency(totalCuts)}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-700 to-black rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">Economia Anual</h3>
            <div className="text-2xl font-bold">{formatCurrency(annualSavings)}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">Total de Cortes</h3>
            <div className="text-2xl font-bold">{cuts.length}</div>
          </div>
        </div>

        {/* Lista de Cortes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resumo dos Cortes
          </h3>
          <div className="space-y-3">
            {cuts.map((cut) => (
              <div key={cut.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{cut.description}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {cut.category === 'essential' ? 'Despesa Essencial' : 'Despesa Não Obrigatória'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(cut.value)}/mês
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(cut.value * 12)}/ano
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCut(cut.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frase Motivacional */}
        <div className="bg-gradient-to-r from-[#e7a034]/10 to-[#e7a034]/5 rounded-2xl p-6 text-center">
          <p className="text-lg font-medium text-[#e7a034]">
            💭 "Um real bem cuidado hoje vira trinta motivos para agradecer amanhã."
          </p>
        </div>
      </div>
    );
  };

  const renderPatrimony = () => (
    <div className={`space-y-6 ${typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'max-h-screen overflow-hidden' : ''}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          💰 Patrimônio
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Planilha da Riqueza - Acompanhe a evolução do seu patrimônio
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
        {/* Coluna Esquerda */}
        <div className="space-y-6">
          {/* Formulário */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Registrar Patrimônio
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Período (ex: Jan/2024)"
                value={newPatrimony.period}
                onChange={(e) => setNewPatrimony({...newPatrimony, period: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="number"
                placeholder="Valor em Banco"
                value={newPatrimony.bank}
                onChange={(e) => setNewPatrimony({...newPatrimony, bank: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="number"
                placeholder="Valor em Corretora"
                value={newPatrimony.brokerage}
                onChange={(e) => setNewPatrimony({...newPatrimony, brokerage: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="number"
                placeholder="Valor em Bens"
                value={newPatrimony.assets}
                onChange={(e) => setNewPatrimony({...newPatrimony, assets: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <button
              onClick={addPatrimony}
              className="w-full mt-4 px-4 py-2 bg-[#e7a034] text-white rounded-lg hover:bg-[#d4941f] transition-colors text-sm"
            >
              Adicionar
            </button>
          </div>

          {/* Legenda */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legenda Ilustrativa
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Wallet className="text-blue-600" size={16} />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Banco</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Conta corrente</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="text-green-600" size={16} />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Corretora</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Investimentos</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <DollarSign className="text-purple-600" size={16} />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Bens</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Patrimônio físico</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          {/* Tabela de Patrimônio */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Evolução Patrimonial
            </h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-gray-800">
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-2 px-2 font-medium text-gray-900 dark:text-white">Período</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-900 dark:text-white">Banco</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-900 dark:text-white">Corretora</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-900 dark:text-white">Bens</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-900 dark:text-white">Total</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-900 dark:text-white">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {patrimonyEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 px-2 text-gray-900 dark:text-white">{entry.period}</td>
                      <td className="py-2 px-2 text-right text-gray-900 dark:text-white">{formatCurrency(entry.bank)}</td>
                      <td className="py-2 px-2 text-right text-gray-900 dark:text-white">{formatCurrency(entry.brokerage)}</td>
                      <td className="py-2 px-2 text-right text-gray-900 dark:text-white">{formatCurrency(entry.assets)}</td>
                      <td className="py-2 px-2 text-right font-semibold text-green-600">{formatCurrency(entry.total)}</td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => deletePatrimony(entry.id)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráfico de Evolução com Linhas */}
          {patrimonyEntries.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Gráfico de Evolução
              </h3>
              <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 400 150">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line
                      key={i}
                      x1="30"
                      y1={20 + i * 26}
                      x2="370"
                      y2={20 + i * 26}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {patrimonyEntries.length > 0 && (() => {
                    const maxValue = Math.max(...patrimonyEntries.map(e => e.total));
                    const minValue = Math.min(...patrimonyEntries.map(e => e.total));
                    const range = maxValue - minValue;
                    
                    return [0, 1, 2, 3, 4].map(i => {
                      const value = minValue + (range * (4 - i) / 4);
                      const formattedValue = value >= 1000 
                        ? `R$${(value / 1000).toFixed(0)}K`
                        : formatCurrency(value);
                      
                      return (
                        <text
                          key={i}
                          x="25"
                          y={24 + i * 26}
                          textAnchor="end"
                          className="text-xs fill-gray-600 dark:fill-gray-400"
                        >
                          {formattedValue}
                        </text>
                      );
                    });
                  })()}
                  
                  {/* Line chart */}
                  {patrimonyEntries.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#e7a034"
                      strokeWidth="2"
                      points={patrimonyEntries.map((entry, index) => {
                        const x = 30 + (index * (340 / (patrimonyEntries.length - 1)));
                        const maxValue = Math.max(...patrimonyEntries.map(e => e.total));
                        const minValue = Math.min(...patrimonyEntries.map(e => e.total));
                        const range = maxValue - minValue || 1;
                        const y = 124 - (((entry.total - minValue) / range) * 84);
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}
                  
                  {/* Data points */}
                  {patrimonyEntries.map((entry, index) => {
                    const x = 30 + (index * (340 / (patrimonyEntries.length - 1)));
                    const maxValue = Math.max(...patrimonyEntries.map(e => e.total));
                    const minValue = Math.min(...patrimonyEntries.map(e => e.total));
                    const range = maxValue - minValue || 1;
                    const y = 124 - (((entry.total - minValue) / range) * 84);
                    
                    return (
                      <g key={entry.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#e7a034"
                        />
                        <text
                          x={x}
                          y={145}
                          textAnchor="middle"
                          className="text-xs fill-gray-600 dark:fill-gray-400"
                        >
                          {entry.period}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnnual = () => {
    const totalEarned = annualBalances.reduce((sum, balance) => sum + balance.earned, 0);
    const totalSpent = annualBalances.reduce((sum, balance) => sum + balance.spent, 0);
    const totalBalance = totalEarned - totalSpent;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ⏱️ Ganho Líquido
          </h2>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Registrar Balanço
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Período (ex: 2024)"
              value={newBalance.period}
              onChange={(e) => setNewBalance({...newBalance, period: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Quanto ganhou"
              value={newBalance.earned}
              onChange={(e) => setNewBalance({...newBalance, earned: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Quanto gastou"
              value={newBalance.spent}
              onChange={(e) => setNewBalance({...newBalance, spent: e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={addBalance}
              className="px-6 py-2 bg-[#e7a034] text-white rounded-lg hover:bg-[#d4941f] transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Gráfico de Pizza com Percentuais na Legenda - Só mostra se totalBalance >= 0 */}
        {annualBalances.length > 0 && totalBalance >= 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Balanço Anual
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {(() => {
                    if (totalEarned === 0) return null;
                    
                    const spentPercent = (totalSpent / totalEarned) * 100;
                    const balancePercent = (totalBalance / totalEarned) * 100;
                    
                    const spentAngle = (spentPercent / 100) * 360;
                    const balanceAngle = (balancePercent / 100) * 360;
                    
                    const x1 = 100 + 50 * Math.cos(0);
                    const y1 = 100 + 50 * Math.sin(0);
                    const x2 = 100 + 50 * Math.cos((spentAngle * Math.PI) / 180);
                    const y2 = 100 + 50 * Math.sin((spentAngle * Math.PI) / 180);
                    const x3 = 100 + 50 * Math.cos(((spentAngle + balanceAngle) * Math.PI) / 180);
                    const y3 = 100 + 50 * Math.sin(((spentAngle + balanceAngle) * Math.PI) / 180);
                    
                    const spentLargeArc = spentAngle > 180 ? 1 : 0;
                    const balanceLargeArc = balanceAngle > 180 ? 1 : 0;
                    
                    // Destacar a fatia que sobrou
                    const balanceMidAngle = spentAngle + (balanceAngle / 2);
                    const highlightX = 100 + 5 * Math.cos((balanceMidAngle * Math.PI) / 180);
                    const highlightY = 100 + 5 * Math.sin((balanceMidAngle * Math.PI) / 180);
                    
                    return (
                      <>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 50 50 0 ${spentLargeArc} 1 ${x2} ${y2} Z`}
                          fill="#ef4444"
                          stroke="white"
                          strokeWidth="2"
                        />
                        
                        <g transform={`translate(${highlightX - 100}, ${highlightY - 100})`}>
                          <path
                            d={`M 100 100 L ${x2} ${y2} A 50 50 0 ${balanceLargeArc} 1 ${x3} ${y3} Z`}
                            fill="#22c55e"
                            stroke="white"
                            strokeWidth="3"
                          />
                        </g>
                      </>
                    );
                  })()}
                </svg>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px]">
                    Gastou
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(totalSpent)} ({totalEarned > 0 ? Math.round((totalSpent / totalEarned) * 100) : 0}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px]">
                    Sobrou
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(totalBalance)} ({totalEarned > 0 ? Math.round((totalBalance / totalEarned) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-lg font-medium text-[#e7a034]">
                🤔 Você ficou satisfeito<br />com a fatia que sobrou?
              </p>
            </div>
          </div>
        )}

        {/* Resumo Total */}
        {annualBalances.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resumo Total dos Registros
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#e7a034] to-[#d4941f] rounded-2xl p-6 text-white text-center">
                <div className="text-2xl font-bold mb-2">
                  {formatCurrency(totalEarned)}
                </div>
                <div className="text-sm opacity-90">
                  Total Ganho
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-black rounded-2xl p-6 text-white text-center">
                <div className="text-2xl font-bold mb-2">
                  {formatCurrency(totalSpent)}
                </div>
                <div className="text-sm opacity-90">
                  Total Gasto
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-6 text-white text-center">
                <div className={`text-2xl font-bold mb-2 ${totalBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {formatCurrency(totalBalance)}
                </div>
                <div className="text-sm opacity-90">
                  Sobra Final
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Balanços */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Histórico de Balanços
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Período</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Ganhou</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Gastou</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Sobrou</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Ações</th>
                </tr>
              </thead>
              <tbody>
                {annualBalances.map((balance) => (
                  <tr key={balance.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{balance.period}</td>
                    <td className="py-3 px-4 text-right text-green-600">{formatCurrency(balance.earned)}</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatCurrency(balance.spent)}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(balance.balance)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {balance.balance >= 0 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs">
                          Positivo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs">
                          Negativo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteBalance(balance.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCalculator = () => {
    const finalResult = calcResults.length > 0 ? calcResults[calcResults.length - 1] : null;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🧮 Simulador de Juros
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Calculadora de Juros Compostos
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Parâmetros da Simulação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor Inicial
              </label>
              <input
                type="number"
                placeholder=""
                value={calcValues.initialValue}
                onChange={(e) => setCalcValues({...calcValues, initialValue: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aporte Mensal
              </label>
              <input
                type="number"
                placeholder=""
                value={calcValues.monthlyContribution}
                onChange={(e) => setCalcValues({...calcValues, monthlyContribution: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Taxa Anual (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder=""
                value={calcValues.annualRate}
                onChange={(e) => setCalcValues({...calcValues, annualRate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período (anos)
              </label>
              <input
                type="number"
                placeholder=""
                value={calcValues.years}
                onChange={(e) => setCalcValues({...calcValues, years: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Resultados */}
        {finalResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#dd9828] to-[#b8801f] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Total Investido</h3>
              <div className="text-2xl font-bold">{formatCurrency(finalResult.contribution)}</div>
            </div>
            <div className="bg-gradient-to-br from-[#040509] to-[#1a1a1a] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Juros Ganhos</h3>
              <div className="text-2xl font-bold">{formatCurrency(finalResult.interest)}</div>
            </div>
            <div className="bg-gradient-to-br from-[#2b3747] to-[#1e2832] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Valor Final</h3>
              <div className="text-2xl font-bold">{formatCurrency(finalResult.total)}</div>
            </div>
          </div>
        )}

        {/* Gráfico Interativo com Barras */}
        {calcResults.length > 0 && calcValues.years && Number(calcValues.years) > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Evolução do Investimento - Destaque Visual Juros x Aportes
            </h3>
            <div className="w-full overflow-x-auto">
              <div className="flex items-end justify-center gap-2 px-4 h-64 relative" style={{ minWidth: `${Math.max(400, Number(calcValues.years) * 80)}px` }}>
                {Array.from({length: Number(calcValues.years)}, (_, yearIndex) => {
                  const result = calcResults[((yearIndex + 1) * 12) - 1] || calcResults[calcResults.length - 1];
                  const maxValue = Math.max(...calcResults.map(r => r.total));
                  const contributionHeight = (result.contribution / maxValue) * 200;
                  const interestHeight = (result.interest / maxValue) * 200;
                  
                  return (
                    <div 
                      key={yearIndex} 
                      className="flex flex-col items-center group relative cursor-pointer"
                      style={{ minWidth: `${Math.max(60, 300 / Number(calcValues.years))}px` }}
                    >
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {yearIndex + 1}a
                      </div>
                      <div className="relative flex flex-col w-full max-w-20">
                        <div
                          className="bg-gradient-to-t from-[#dd9828] to-[#e7a034] w-full transition-all duration-300 group-hover:from-[#b8801f] group-hover:to-[#d4941f]"
                          style={{ height: `${interestHeight}px` }}
                        ></div>
                        <div
                          className="bg-gradient-to-t from-[#040509] to-[#2b3747] w-full transition-all duration-300 group-hover:from-[#1a1a1a] group-hover:to-[#1e2832]"
                          style={{ height: `${contributionHeight}px` }}
                        ></div>
                      </div>
                      {/* Tooltip centralizado */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                        <div>Total: {formatCurrency(result.total)}</div>
                        <div>Aportes: {formatCurrency(result.contribution)}</div>
                        <div>Juros: {formatCurrency(result.interest)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-[#040509] to-[#2b3747] rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Aportes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-[#dd9828] to-[#e7a034] rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Juros</span>
              </div>
            </div>
          </div>
        )}

        {/* Frase Motivacional */}
        <div className="bg-gradient-to-r from-[#e7a034]/10 to-[#e7a034]/5 rounded-2xl p-6 text-center">
          <p className="text-lg font-medium text-[#e7a034]">
            🌱 "Os juros compostos são a oitava maravilha do mundo. Quem entende, ganha; quem não entende, paga." — Albert Einstein
          </p>
        </div>
      </div>
    );
  };

  const renderLibrary = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📚 Biblioteca de Desenvolvimento
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Conhecimento é o melhor investimento que você pode fazer
        </p>
      </div>

      {/* Livros Recomendados */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Livros Recomendados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <img
                src={book.cover}
                alt={book.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {book.author}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {book.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdos Educativos */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conteúdos e Insights
        </h3>
        <div className="space-y-4">
          {educationalContent.map((content) => (
            <div key={content.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-[#e7a034]/20 text-[#e7a034] rounded-full text-xs">
                  {content.category}
                </span>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {content.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {content.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas Adicionais */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Opções de Reserva de Emergência
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-[#e7a034] to-[#d4941f] rounded-lg text-white">
            <h4 className="font-semibold mb-2">
              Tesouro Direto - SELIC
            </h4>
            <p className="text-sm opacity-90">
              Liquidez diária, rentabilidade atrelada à taxa básica de juros.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#e7a034] to-[#d4941f] rounded-lg text-white">
            <h4 className="font-semibold mb-2">
              CDB com Liquidez Diária
            </h4>
            <p className="text-sm opacity-90">
              Grandes bancos, garantia do FGC, resgate a qualquer momento.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#e7a034] to-[#d4941f] rounded-lg text-white">
            <h4 className="font-semibold mb-2">
              Fundo DI - Taxa Zero
            </h4>
            <p className="text-sm opacity-90">
              Sem taxa de administração, liquidez diária, baixo risco.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#e7a034] to-[#d4941f] rounded-lg text-white">
            <h4 className="font-semibold mb-2">
              Conta Remunerada
            </h4>
            <p className="text-sm opacity-90">
              Caixinha Nubank, liquidez imediata, rendimento diário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

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
      case 'objectives': return renderObjectives();
      case 'calculator': return renderCalculator();
      case 'budget': return renderBudget();
      case 'cuts': return renderCuts();
      case 'patrimony': return renderPatrimony();
      case 'annual': return renderAnnual();
      case 'library': return renderLibrary();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile: Menu à esquerda */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Logo centralizada */}
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

            {/* Controles à direita */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              {/* Desktop: Botão Sair */}
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
          {/* Mobile Navigation Drawer */}
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
                    {/* Mobile: Botão Sair no drawer */}
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

          {/* Desktop Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}