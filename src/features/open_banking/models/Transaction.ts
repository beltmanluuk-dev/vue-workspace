/**
 * Open Banking Transaction Model
 */

export type TransactionType = 'income' | 'expense' | 'transfer' | 'payment' | 'refund' | 'other';
export type TransactionStatus = 'booked' | 'pending';

export interface Transaction {
  id: string;
  accountId: string;
  providerId: string;
  externalId: string;
  amount: number;
  currency: string;
  description?: string;
  counterparty?: string;
  counterpartyAccount?: string;
  type: TransactionType;
  status: TransactionStatus;
  category?: string;
  bookedAt: Date;
  valueDate?: Date;
  metadata?: Record<string, unknown>;
  isRecurring?: boolean;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  cursor?: string;
}

export interface TransactionQuery {
  accountIds?: string[];
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  cursor?: string;
}
