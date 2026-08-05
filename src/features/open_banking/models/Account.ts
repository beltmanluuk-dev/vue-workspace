/**
 * Open Banking Account Model
 * Leverantörsagnostisk representation av ett bankkonto.
 */

export type AccountType = 'checking' | 'savings' | 'credit' | 'loan' | 'investment' | 'other';
export type AccountStatus = 'active' | 'inactive' | 'blocked' | 'closed';

export interface Account {
  id: string;
  providerId: string;        // t.ex. 'tink'
  externalId: string;        // bankens/kontots externa id
  name: string;
  accountNumber?: string;
  type: AccountType;
  status: AccountStatus;
  currency: string;
  balance: number;
  availableBalance?: number;
  ownerName?: string;
  bankName?: string;
  countryCode?: string;
  metadata?: Record<string, unknown>;
  connectedAt: Date;
  lastSyncedAt: Date;
}

export interface AccountListResponse {
  accounts: Account[];
  total: number;
  cursor?: string;
}
