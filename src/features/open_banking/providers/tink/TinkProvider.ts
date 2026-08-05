/**
 * Tink Open Banking Provider (placeholder)
 * Implementerar OpenBankingProvider-kontraktet för Tink.
 */

import type { OpenBankingProvider, OpenBankingProviderConfig } from '../OpenBankingProvider';
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
} from '../../models';
import { TinkApiClient } from '../../api';
import { getTinkConfig } from './TinkConfig';

export class TinkProvider implements OpenBankingProvider {
  public readonly providerId = 'tink';
  public config: OpenBankingProviderConfig;
  private apiClient?: TinkApiClient;

  constructor() {
    const tinkConfig = getTinkConfig();
    this.config = {
      providerId: this.providerId,
      baseUrl: tinkConfig.baseUrl,
      clientId: tinkConfig.clientId,
      redirectUrl: tinkConfig.redirectUrl,
      environment: tinkConfig.environment,
    };
  }

  public async initialize(config: OpenBankingProviderConfig): Promise<void> {
    this.config = config;
    this.apiClient = new TinkApiClient({
      baseUrl: config.baseUrl || getTinkConfig().baseUrl,
      clientId: config.clientId || getTinkConfig().clientId,
      redirectUrl: config.redirectUrl || getTinkConfig().redirectUrl,
    });
  }

  public async authenticate(): Promise<string> {
    throw new Error('Tink authenticate() är inte implementerad. Använd TinkAuthService för OAuth-flöde.');
  }

  public async refreshAccessToken(): Promise<string> {
    throw new Error('Tink refreshAccessToken() är inte implementerad.');
  }

  public async listAccounts(): Promise<AccountListResponse> {
    return { accounts: [], total: 0 };
  }

  public async getBalances(): Promise<AccountBalance[]> {
    return [];
  }

  public async listTransactions(query: TransactionQuery): Promise<TransactionListResponse> {
    return { transactions: [], total: 0 };
  }

  public async listRecurringPayments(): Promise<PaymentListResponse> {
    return { payments: [], total: 0 };
  }

  public async createConsent(request: ConsentRequest): Promise<Consent> {
    throw new Error('Tink createConsent() är inte implementerad.');
  }

  public async getConsent(id: string): Promise<Consent> {
    throw new Error('Tink getConsent() är inte implementerad.');
  }

  public async revokeConsent(id: string): Promise<void> {
    throw new Error('Tink revokeConsent() är inte implementerad.');
  }

  public async detectSubscriptions(): Promise<SubscriptionListResponse> {
    return { subscriptions: [], total: 0 };
  }

  public async summarizeIncomeAndExpenses(): Promise<IncomeExpenseSummary> {
    throw new Error('Tink summarizeIncomeAndExpenses() är inte implementerad.');
  }
}
