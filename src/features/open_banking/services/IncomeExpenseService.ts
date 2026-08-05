/**
 * Income & Expense Service
 */

import type { TransactionRepository } from '../repositories';
import type { IncomeExpenseSummary, ExpenseCategorySummary } from '../models';

export class IncomeExpenseService {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  public async summarize(period: 'month' | 'quarter' | 'year'): Promise<IncomeExpenseSummary> {
    const now = new Date();
    const start = new Date(now);
    if (period === 'month') start.setMonth(start.getMonth() - 1);
    if (period === 'quarter') start.setMonth(start.getMonth() - 3);
    if (period === 'year') start.setFullYear(start.getFullYear() - 1);

    const { transactions } = await this.transactionRepository.list({ fromDate: start, toDate: now });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryMap = new Map<string, { amount: number; count: number }>();

    for (const tx of transactions) {
      if (tx.amount > 0) {
        totalIncome += tx.amount;
      } else {
        totalExpenses += Math.abs(tx.amount);
        const category = tx.category || 'Okategoriserat';
        const existing = categoryMap.get(category) || { amount: 0, count: 0 };
        existing.amount += Math.abs(tx.amount);
        existing.count += 1;
        categoryMap.set(category, existing);
      }
    }

    const categories: ExpenseCategorySummary[] = [];
    for (const [category, data] of categoryMap.entries()) {
      categories.push({
        category,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count,
      });
    }

    categories.sort((a, b) => b.amount - a.amount);

    return {
      currency: 'SEK',
      period,
      periodStart: start,
      periodEnd: now,
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      categories,
    };
  }
}
