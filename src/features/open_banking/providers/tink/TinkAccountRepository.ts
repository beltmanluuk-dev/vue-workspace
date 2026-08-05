/**
 * Tink Account Repository (placeholder)
 */

import type { AccountRepository } from '../../repositories';
import type { Account, AccountListResponse } from '../../models';
import { TinkProvider } from './TinkProvider';

export class TinkAccountRepository implements AccountRepository {
  private provider: TinkProvider;

  constructor(provider: TinkProvider) {
    this.provider = provider;
  }

  public async getAll(): Promise<AccountListResponse> {
    return this.provider.listAccounts();
  }

  public async getById(): Promise<Account | null> {
    return null;
  }

  public async save(account: Account): Promise<Account> {
    return account;
  }

  public async delete(): Promise<void> {
    return;
  }

  public async sync(): Promise<AccountListResponse> {
    return this.provider.listAccounts();
  }
}
