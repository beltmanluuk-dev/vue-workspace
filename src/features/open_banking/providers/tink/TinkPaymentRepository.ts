/**
 * Tink Payment Repository (placeholder)
 */

import type { PaymentRepository } from '../../repositories';
import type { PaymentListResponse } from '../../models';
import { TinkProvider } from './TinkProvider';

export class TinkPaymentRepository implements PaymentRepository {
  private provider: TinkProvider;

  constructor(provider: TinkProvider) {
    this.provider = provider;
  }

  public async list(): Promise<PaymentListResponse> {
    return this.provider.listRecurringPayments();
  }

  public async getById(): Promise<null> {
    return null;
  }

  public async sync(): Promise<PaymentListResponse> {
    return this.provider.listRecurringPayments();
  }
}
