/**
 * Subscription Detection Service
 * Analyserar transaktioner för att hitta återkommande abonnemang.
 */

import type { TransactionRepository } from '../repositories';
import type { Subscription, SubscriptionListResponse } from '../models';

export class SubscriptionDetectionService {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  public async detect(): Promise<SubscriptionListResponse> {
    const { transactions } = await this.transactionRepository.list({ limit: 1000 });

    const grouped = new Map<string, { amount: number; count: number; dates: Date[] }>();

    for (const tx of transactions) {
      if (tx.amount >= 0) continue; // Endast utgifter
      const key = `${tx.description}|${Math.abs(tx.amount)}`;
      const existing = grouped.get(key) || { amount: Math.abs(tx.amount), count: 0, dates: [] };
      existing.count += 1;
      existing.dates.push(tx.bookedAt);
      grouped.set(key, existing);
    }

    const subscriptions: Subscription[] = [];
    for (const [key, data] of grouped.entries()) {
      if (data.count < 2) continue;
      const [name] = key.split('|');
      data.dates.sort((a, b) => a.getTime() - b.getTime());

      subscriptions.push({
        id: `sub-${key}`,
        name: name || 'Okänd tjänst',
        provider: 'unknown',
        amount: data.amount,
        currency: 'SEK',
        frequency: 'monthly',
        status: 'active',
        lastPaymentDate: data.dates[data.dates.length - 1],
      });
    }

    return { subscriptions, total: subscriptions.length };
  }
}
