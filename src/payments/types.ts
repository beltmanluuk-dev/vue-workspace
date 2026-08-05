/**
 * VUE Payment System Types
 * Svenska betalningsmetoder - ingen Stripe
 */

export type PaymentMethodType = 'apple_pay' | 'bank_transfer' | 'autogiro' | 'swish';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'scheduled';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  isDefault: boolean;
  isEnabled: boolean;
  // För Apple Pay
  applePayMerchantId?: string;
  // För banköverföring
  bankAccount?: {
    bankName: string;
    accountNumber: string; // Maskerat
    clearingNumber: string;
  };
  // För Autogiro
  autogiroMandate?: {
    mandateId: string;
    bankName: string;
    status: 'active' | 'pending' | 'cancelled';
  };
}

export interface PaymentRequest {
  id: string;
  billId: string;
  amount: number;
  currency: 'SEK';
  recipientName: string;
  recipientAccount?: string;
  recipientBankgiro?: string;
  recipientPlusgiro?: string;
  reference?: string;
  message?: string;
  dueDate: Date;
  paymentMethod: PaymentMethodType;
  requiresBiometric: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  status: PaymentStatus;
  timestamp: Date;
  errorMessage?: string;
  errorCode?: string;
}

export interface ScheduledPayment {
  id: string;
  billId: string;
  amount: number;
  scheduledDate: Date;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  attempts: number;
  lastAttempt?: Date;
  nextRetry?: Date;
}

export interface PaymentSchedulerConfig {
  maxRetries: number;
  retryDelayMinutes: number;
  autoRescheduleOnFailure: boolean;
  notifyOnFailure: boolean;
  requireBiometricAbove: number; // Belopp i SEK
}

export const DEFAULT_SCHEDULER_CONFIG: PaymentSchedulerConfig = {
  maxRetries: 3,
  retryDelayMinutes: 60,
  autoRescheduleOnFailure: true,
  notifyOnFailure: true,
  requireBiometricAbove: 500, // Kräv biometri för belopp över 500 kr
};
