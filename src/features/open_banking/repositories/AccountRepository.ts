/**
 * Account Repository
 * Abstrakt lagring/åtkomst för konton. Kan bytas ut mot lokal DB, API eller mock.
 */

import type { Account, AccountListResponse } from '../models';

export interface AccountRepository {
  getAll(): Promise<AccountListResponse>;
  getById(id: string): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  delete(id: string): Promise<void>;
  sync(): Promise<AccountListResponse>;
}
