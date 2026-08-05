/**
 * Open Banking Provider Interface
 * Abstrakt kontrakt för alla Open Banking-leverantörer (Tink, m.fl.).
 */

import type {
  AccountListResponse,
  TransactionListResponse,
  TransactionQuery,
  AccountBalance,
  PaymentListResponse,
  Consent,
  ConsentRequest,
  SubscriptionListResponse,
  IncomeExpenseSummary,
} from '../models';

export interface OpenBankingProviderConfig {
  providerId: string;
  baseUrl?: string;
  clientId?: string;
  redirectUrl?: string;
  environment?: 'sandbox' | 'production';
}

export interface OpenBankingProvider {
  readonly providerId: string;
  readonly config: OpenBankingProviderConfig;

  initialize(config: OpenBankingProviderConfig): Promise<void>;

  authenticate(): Promise<string>;
  refreshAccessToken(): Promise<string>;

  listAccounts(): Promise<AccountListResponse>;
  getBalances(accountIds: string[]): Promise<AccountBalance[]>;
  listTransactions(query: TransactionQuery): Promise<TransactionListResponse>;
  listRecurringPayments(): Promise<PaymentListResponse>;

  createConsent(request: ConsentRequest): Promise<Consent>;
  getConsent(consentId: string): Promise<Consent>;
  revokeConsent(consentId: string): Promise<void>;

  detectSubscriptions(): Promise<SubscriptionListResponse>;
  summarizeIncomeAndExpenses(period: 'month' | 'quarter' | 'year'): Promise<IncomeExpenseSummary>;
}
