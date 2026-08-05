import { Bill } from '../types';

export interface PaymentHistory {
  vendor: string;
  amounts: number[];
  averageAmount: number;
}

export interface DeviationResult {
  hasDeviation: boolean;
  deviationPercentage: number;
  averageAmount: number;
  currentAmount: number;
}

const DEVIATION_THRESHOLD = 0.20; // 20%

export class ClarityEngine {
  private paymentHistory: Map<string, PaymentHistory> = new Map();

  constructor(bills: Bill[]) {
    this.buildPaymentHistory(bills);
  }

  private buildPaymentHistory(bills: Bill[]): void {
    const vendorPayments = new Map<string, number[]>();

    bills.forEach((bill) => {
      const existing = vendorPayments.get(bill.vendor) || [];
      if (bill.averageAmount) {
        existing.push(bill.averageAmount);
      }
      vendorPayments.set(bill.vendor, existing);
    });

    vendorPayments.forEach((amounts, vendor) => {
      const averageAmount = amounts.length > 0
        ? amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
        : 0;

      this.paymentHistory.set(vendor, {
        vendor,
        amounts,
        averageAmount,
      });
    });
  }

  public getAverageForVendor(vendor: string): number {
    const history = this.paymentHistory.get(vendor);
    return history?.averageAmount || 0;
  }

  public checkDeviation(bill: Bill): DeviationResult {
    const averageAmount = bill.averageAmount || this.getAverageForVendor(bill.vendor);
    
    if (averageAmount === 0) {
      return {
        hasDeviation: false,
        deviationPercentage: 0,
        averageAmount: 0,
        currentAmount: bill.amount,
      };
    }

    const deviationPercentage = (bill.amount - averageAmount) / averageAmount;

    return {
      hasDeviation: deviationPercentage >= DEVIATION_THRESHOLD,
      deviationPercentage,
      averageAmount,
      currentAmount: bill.amount,
    };
  }

  public processBills(bills: Bill[]): Bill[] {
    return bills.map((bill) => {
      if (bill.status === 'paid' || bill.status === 'paused') {
        return bill;
      }

      const deviation = this.checkDeviation(bill);

      if (deviation.hasDeviation && bill.status !== 'pending_approval') {
        return {
          ...bill,
          status: 'pending_approval' as const,
        };
      }

      return bill;
    });
  }

  public getBillsRequiringApproval(bills: Bill[]): Bill[] {
    return bills.filter((bill) => {
      const deviation = this.checkDeviation(bill);
      return deviation.hasDeviation && 
        (bill.status === 'pending' || bill.status === 'scheduled' || bill.status === 'pending_approval');
    });
  }
}

export const createClarityEngine = (bills: Bill[]): ClarityEngine => {
  return new ClarityEngine(bills);
};
