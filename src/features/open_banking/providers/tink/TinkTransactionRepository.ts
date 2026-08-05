/**
 * Tink Transaction Repository (placeholder)
 */

import type { TransactionRepository } from '../../repositories';
import type { TransactionListResponse, TransactionQuery } from '../../models';
import { TinkProvider } from './TinkProvider';

export class TinkTransactionRepository implements TransactionRepository {
  private provider: TinkProvider;

  constructor(provider: TinkProvider) {
    this.provider = provider;
  }

  public async list(query: TransactionQuery): Promise<TransactionListResponse> {
    return this.provider.listTransactions(query);
  }

  public async getById(): Promise<null> {
    return null;
  }

  public async sync(query: TransactionQuery): Promise<TransactionListResponse> {
    return this.provider.listTransactions(query);
  }
}
