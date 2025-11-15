import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const calculateMethod60_30_10 = (income: number) => {
  return {
    emergency: income * 0.1,
    essential: income * 0.6,
    nonessential: income * 0.3,
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculateCompoundInterest = (
  initialValue: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
) => {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const results = [];
  
  let total = initialValue;
  let totalContributions = initialValue;
  
  for (let month = 1; month <= months; month++) {
    total = total * (1 + monthlyRate) + monthlyContribution;
    totalContributions += monthlyContribution;
    
    results.push({
      month,
      contribution: totalContributions,
      interest: total - totalContributions,
      total: total,
    });
  }
  
  return results;
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
