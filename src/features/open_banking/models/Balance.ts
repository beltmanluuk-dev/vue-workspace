/**
 * Open Banking Balance Model
 */

export interface Balance {
  accountId: string;
  providerId: string;
  amount: number;
  currency: string;
  type: 'closing' | 'interim' | 'opening' | 'available' | 'credit';
  updatedAt: Date;
}

export interface AccountBalance {
  accountId: string;
  balances: Balance[];
}
