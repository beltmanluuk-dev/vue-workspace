/**
 * Transaction Repository
 */

import type { Transaction, TransactionListResponse, TransactionQuery } from '../models';

export interface TransactionRepository {
  list(query: TransactionQuery): Promise<TransactionListResponse>;
  getById(id: string): Promise<Transaction | null>;
  sync(query: TransactionQuery): Promise<TransactionListResponse>;
}
