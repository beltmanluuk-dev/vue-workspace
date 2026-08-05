/**
 * Open Banking Payment Model
 * Representerar återkommande eller enstaka betalningar.
 */

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'irregular';
export type PaymentStatus = 'active' | 'paused' | 'cancelled';

export interface Payment {
  id: string;
  accountId: string;
  providerId: string;
  externalId: string;
  amount: number;
  currency: string;
  description: string;
  counterparty?: string;
  frequency: PaymentFrequency;
  status: PaymentStatus;
  nextDueDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface PaymentListResponse {
  payments: Payment[];
  total: number;
  cursor?: string;
}
