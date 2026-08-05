/**
 * Consent Repository
 */

import type { Consent, ConsentRequest } from '../models';

export interface ConsentRepository {
  create(request: ConsentRequest): Promise<Consent>;
  getById(id: string): Promise<Consent | null>;
  list(): Promise<Consent[]>;
  revoke(id: string): Promise<void>;
}
