/**
 * Open Banking Service
 * Samordnar repositories och providers. Hanterar val av leverantör.
 */

import type { OpenBankingProvider } from '../providers';
import type { AccountRepository, TransactionRepository, PaymentRepository, ConsentRepository } from '../repositories';

export interface OpenBankingServiceConfig {
  provider: OpenBankingProvider;
  accountRepository: AccountRepository;
  transactionRepository: TransactionRepository;
  paymentRepository: PaymentRepository;
  consentRepository: ConsentRepository;
}

export class OpenBankingService {
  private provider: OpenBankingProvider;
  private accountRepository: AccountRepository;
  private transactionRepository: TransactionRepository;
  private paymentRepository: PaymentRepository;
  private consentRepository: ConsentRepository;

  constructor(config: OpenBankingServiceConfig) {
    this.provider = config.provider;
    this.accountRepository = config.accountRepository;
    this.transactionRepository = config.transactionRepository;
    this.paymentRepository = config.paymentRepository;
    this.consentRepository = config.consentRepository;
  }

  public async syncAccounts(): Promise<void> {
    const response = await this.provider.listAccounts();
    for (const account of response.accounts) {
      await this.accountRepository.save(account);
    }
  }

  public async syncTransactions(query?: { accountIds?: string[]; fromDate?: Date; toDate?: Date }): Promise<void> {
    await this.provider.listTransactions({ ...query });
  }

  public async syncPayments(): Promise<void> {
    await this.provider.listRecurringPayments();
  }

  public async requestConsent(): Promise<void> {
    // Placeholder: implementeras när specifik provider är vald.
  }
}
