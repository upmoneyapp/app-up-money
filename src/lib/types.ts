export interface BudgetItem {
  id: string;
  description: string;
  category: 'emergency' | 'essential' | 'nonessential';
  value: number;
}

export interface Cut {
  id: string;
  description: string;
  value: number;
  category: 'essential' | 'nonessential';
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  value: number;
  date: Date;
  isRecurring: boolean;
  isPaid: boolean;
  category: 'emergency' | 'essential' | 'nonessential';
}

export interface PatrimonyEntry {
  id: string;
  period: string;
  bank: number;
  brokerage: number;
  assets: number;
  total: number;
}

export interface AnnualBalance {
  id: string;
  period: string;
  earned: number;
  spent: number;
  balance: number;
}

export interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  isCompleted: boolean;
}

export interface CompoundInterestResult {
  month: number;
  contribution: number;
  interest: number;
  total: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  cover: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: string;
}