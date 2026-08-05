/**
 * Tink Consent Repository (placeholder)
 */

import type { ConsentRepository } from '../../repositories';
import type { Consent, ConsentRequest } from '../../models';
import { TinkProvider } from './TinkProvider';

export class TinkConsentRepository implements ConsentRepository {
  private provider: TinkProvider;

  constructor(provider: TinkProvider) {
    this.provider = provider;
  }

  public async create(request: ConsentRequest): Promise<Consent> {
    return this.provider.createConsent(request);
  }

  public async getById(id: string): Promise<Consent | null> {
    return this.provider.getConsent(id).catch(() => null);
  }

  public async list(): Promise<Consent[]> {
    return [];
  }

  public async revoke(id: string): Promise<void> {
    return this.provider.revokeConsent(id);
  }
}
