/**
 * Payment Repository
 */

import type { Payment, PaymentListResponse } from '../models';

export interface PaymentRepository {
  list(): Promise<PaymentListResponse>;
  getById(id: string): Promise<Payment | null>;
  sync(): Promise<PaymentListResponse>;
}
