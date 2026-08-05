/**
 * PaymentScheduler
 * Hanterar schemaläggning och körning av betalningar
 */

import {
  PaymentRequest,
  PaymentResult,
  ScheduledPayment,
  PaymentStatus,
  PaymentSchedulerConfig,
  DEFAULT_SCHEDULER_CONFIG,
  PaymentMethodType,
} from './types';
import { ApplePayService } from './ApplePayService';

export class PaymentScheduler {
  private config: PaymentSchedulerConfig;
  private scheduledPayments: Map<string, ScheduledPayment>;
  private applePayService: ApplePayService;

  constructor(config: Partial<PaymentSchedulerConfig> = {}) {
    this.config = { ...DEFAULT_SCHEDULER_CONFIG, ...config };
    this.scheduledPayments = new Map();
    this.applePayService = new ApplePayService();
  }

  /**
   * Schemalägg en ny betalning
   */
  public schedulePayment(
    billId: string,
    amount: number,
    scheduledDate: Date,
    paymentMethod: PaymentMethodType = 'apple_pay'
  ): ScheduledPayment {
    const payment: ScheduledPayment = {
      id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      billId,
      amount,
      scheduledDate,
      paymentMethod,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
      attempts: 0,
    };

    this.scheduledPayments.set(payment.id, payment);
    return payment;
  }

  /**
   * Avbryt schemalagd betalning
   */
  public cancelPayment(paymentId: string): boolean {
    const payment = this.scheduledPayments.get(paymentId);
    if (!payment) return false;

    if (payment.status === 'completed' || payment.status === 'processing') {
      return false; // Kan inte avbryta pågående/genomförda betalningar
    }

    payment.status = 'cancelled';
    payment.updatedAt = new Date();
    this.scheduledPayments.set(paymentId, payment);
    return true;
  }

  /**
   * Flytta betalningsdatum
   */
  public reschedulePayment(paymentId: string, newDate: Date): boolean {
    const payment = this.scheduledPayments.get(paymentId);
    if (!payment) return false;

    if (payment.status !== 'scheduled' && payment.status !== 'failed') {
      return false;
    }

    payment.scheduledDate = newDate;
    payment.status = 'scheduled';
    payment.updatedAt = new Date();
    this.scheduledPayments.set(paymentId, payment);
    return true;
  }

  /**
   * Kör schemalagda betalningar som förfallit
   */
  public async processDuePayments(): Promise<PaymentResult[]> {
    const now = new Date();
    const results: PaymentResult[] = [];

    for (const [id, payment] of this.scheduledPayments) {
      if (payment.status !== 'scheduled') continue;
      if (payment.scheduledDate > now) continue;

      const result = await this.executePayment(payment);
      results.push(result);
    }

    return results;
  }

  /**
   * Kör en specifik betalning
   */
  public async executePayment(payment: ScheduledPayment): Promise<PaymentResult> {
    // Uppdatera status till processing
    payment.status = 'processing';
    payment.attempts++;
    payment.lastAttempt = new Date();
    payment.updatedAt = new Date();
    this.scheduledPayments.set(payment.id, payment);

    try {
      const request: PaymentRequest = {
        id: payment.id,
        billId: payment.billId,
        amount: payment.amount,
        currency: 'SEK',
        recipientName: 'Mottagare', // Skulle hämtas från fakturainfo
        dueDate: payment.scheduledDate,
        paymentMethod: payment.paymentMethod,
        requiresBiometric: payment.amount >= this.config.requireBiometricAbove,
      };

      let result: PaymentResult;

      switch (payment.paymentMethod) {
        case 'apple_pay':
          result = await this.applePayService.initiatePayment(request);
          break;
        case 'bank_transfer':
          result = await this.processBankTransfer(request);
          break;
        case 'autogiro':
          result = await this.processAutogiro(request);
          break;
        case 'swish':
          result = await this.processSwish(request);
          break;
        default:
          result = {
            success: false,
            status: 'failed',
            timestamp: new Date(),
            errorMessage: 'Okänd betalningsmetod',
            errorCode: 'UNKNOWN_METHOD',
          };
      }

      // Uppdatera betalningsstatus
      payment.status = result.status;
      payment.updatedAt = new Date();

      // Hantera misslyckad betalning
      if (!result.success && this.config.autoRescheduleOnFailure) {
        if (payment.attempts < this.config.maxRetries) {
          payment.status = 'scheduled';
          payment.nextRetry = new Date(
            Date.now() + this.config.retryDelayMinutes * 60 * 1000
          );
          payment.scheduledDate = payment.nextRetry;
        }
      }

      this.scheduledPayments.set(payment.id, payment);
      return result;
    } catch (error) {
      console.error('Payment execution failed:', error);
      
      payment.status = 'failed';
      payment.updatedAt = new Date();
      this.scheduledPayments.set(payment.id, payment);

      return {
        success: false,
        status: 'failed',
        timestamp: new Date(),
        errorMessage: 'Ett fel uppstod vid betalningen',
        errorCode: 'EXECUTION_ERROR',
      };
    }
  }

  private async processBankTransfer(request: PaymentRequest): Promise<PaymentResult> {
    // Simulera banköverföring
    // I produktion skulle detta använda Open Banking API (ex. Tink, Plaid)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `BT-${Date.now()}`,
          status: 'completed',
          timestamp: new Date(),
        });
      }, 2000);
    });
  }

  private async processAutogiro(request: PaymentRequest): Promise<PaymentResult> {
    // Simulera Autogiro med Bankgironätet
    // I produktion skulle detta kommunicera med Bankgirots API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Autogiro har en mycket hög success rate men kräver giltigt mandat
        const hasMandate = !!request.recipientBankgiro;
        if (!hasMandate) {
          resolve({
            success: false,
            status: 'failed',
            timestamp: new Date(),
            errorMessage: 'Inget autogiromandat finns för mottagaren',
            errorCode: 'AUTOGIRO_NO_MANDATE',
          });
          return;
        }

        // 98% success rate för autogiro
        if (Math.random() < 0.98) {
          resolve({
            success: true,
            transactionId: `AG-${Date.now()}`,
            status: 'completed',
            timestamp: new Date(),
          });
        } else {
          resolve({
            success: false,
            status: 'failed',
            timestamp: new Date(),
            errorMessage: 'Autogirobetalningen avvisades av banken',
            errorCode: 'AUTOGIRO_REJECTED',
          });
        }
      }, 1000);
    });
  }

  private async processSwish(request: PaymentRequest): Promise<PaymentResult> {
    // Simulera Swish-betalning
    // I produktion skulle detta använda Swish API eller BankID
    return new Promise((resolve) => {
      setTimeout(() => {
        // Swish är snabb men kan misslyckas vid otillräckligt saldo
        const hasSufficientBalance = request.amount <= 5000 || Math.random() > 0.1;
        if (hasSufficientBalance) {
          resolve({
            success: true,
            transactionId: `SW-${Date.now()}`,
            status: 'completed',
            timestamp: new Date(),
          });
        } else {
          resolve({
            success: false,
            status: 'failed',
            timestamp: new Date(),
            errorMessage: 'Swish-betalningen misslyckades, kontrollera saldot',
            errorCode: 'SWISH_INSUFFICIENT_FUNDS',
          });
        }
      }, 800);
    });
  }

  /**
   * Hämta alla schemalagda betalningar
   */
  public getScheduledPayments(): ScheduledPayment[] {
    return Array.from(this.scheduledPayments.values());
  }

  /**
   * Hämta betalningar som väntar
   */
  public getPendingPayments(): ScheduledPayment[] {
    return this.getScheduledPayments().filter(
      p => p.status === 'scheduled' || p.status === 'pending'
    );
  }

  /**
   * Hämta misslyckade betalningar
   */
  public getFailedPayments(): ScheduledPayment[] {
    return this.getScheduledPayments().filter(p => p.status === 'failed');
  }

  /**
   * Hämta betalning för specifik faktura
   */
  public getPaymentForBill(billId: string): ScheduledPayment | undefined {
    return this.getScheduledPayments().find(p => p.billId === billId);
  }

  /**
   * Optimera betalningsdatum baserat på lönecykel
   */
  public optimizePaymentDate(
    currentDate: Date,
    payday: number,
    amount: number
  ): Date {
    const optimalDay = payday + 3; // 3 dagar efter lön
    const optimizedDate = new Date(currentDate);
    
    // Om fakturadatumet är före optimalt, flytta framåt
    if (currentDate.getDate() < optimalDay) {
      optimizedDate.setDate(optimalDay);
    } else if (currentDate.getDate() > payday + 15) {
      // Om det är sent i månaden, överväg att flytta till nästa månad
      optimizedDate.setMonth(optimizedDate.getMonth() + 1);
      optimizedDate.setDate(optimalDay);
    }

    return optimizedDate;
  }

  /**
   * Prioritera betalningar baserat på kategori och belopp
   */
  public prioritizePayments(payments: ScheduledPayment[]): ScheduledPayment[] {
    // Sortera: Kritiska först, sedan efter belopp
    return [...payments].sort((a, b) => {
      // I produktion skulle vi ha kategori-info
      // För nu, sortera efter belopp (högre = högre prioritet)
      return b.amount - a.amount;
    });
  }
}

export default PaymentScheduler;
