/**
 * Subscription Model
 * Identifierat återkommande abonnemang baserat på transaktioner.
 */

export type SubscriptionStatus = 'active' | 'cancelled' | 'paused' | 'unknown';

export interface Subscription {
  id: string;
  name: string;
  provider: string;
  amount: number;
  currency: string;
  frequency: 'monthly' | 'yearly' | 'weekly' | 'daily' | 'unknown';
  status: SubscriptionStatus;
  nextPaymentDate?: Date;
  lastPaymentDate?: Date;
  category?: string;
  accountId?: string;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
}
