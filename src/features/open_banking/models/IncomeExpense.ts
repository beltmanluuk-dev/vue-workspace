/**
 * Income & Expense Aggregate Model
 */

export interface IncomeExpenseSummary {
  accountId?: string;
  currency: string;
  period: 'month' | 'quarter' | 'year';
  periodStart: Date;
  periodEnd: Date;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categories: ExpenseCategorySummary[];
}

export interface ExpenseCategorySummary {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}
