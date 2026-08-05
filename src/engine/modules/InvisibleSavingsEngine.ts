/**
 * InvisibleSavingsEngine
 * Bygger automatisk mikro-buffert genom små intelligenta reserveringar
 */

import { Bill } from '../../types';
import {
  InvisibleSavings,
  UserFinancialProfile,
} from '../types';

export interface SavingsTransaction {
  date: Date;
  amount: number;
  type: 'deposit' | 'withdrawal';
  reason: string;
}

export class InvisibleSavingsEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];
  private savingsHistory: SavingsTransaction[];

  constructor(
    profile: UserFinancialProfile,
    bills: Bill[],
    savingsHistory: SavingsTransaction[] = []
  ) {
    this.profile = profile;
    this.bills = bills;
    this.savingsHistory = savingsHistory;
  }

  /**
   * Analysera och beräkna osynligt sparande
   */
  public analyze(): InvisibleSavings {
    const currentBuffer = this.calculateCurrentBuffer();
    const monthlyContribution = this.calculateMonthlyContribution();
    const projectedAnnual = this.projectAnnualSavings(monthlyContribution);
    const lastContribution = this.getLastContribution();
    const isActive = this.isSystemActive();

    return {
      currentBuffer,
      monthlyContribution,
      projectedAnnualSavings: projectedAnnual,
      lastContribution,
      isActive,
      confidenceScore: this.calculateConfidence(),
      dataQuality: this.assessDataQuality(),
      lastUpdated: new Date(),
    };
  }

  private calculateCurrentBuffer(): number {
    // Summera alla transaktioner
    return this.savingsHistory.reduce((sum, tx) => {
      return tx.type === 'deposit' ? sum + tx.amount : sum - tx.amount;
    }, 0);
  }

  private calculateMonthlyContribution(): number {
    // Basera på marginal mellan inkomst och utgifter
    const surplus = this.profile.monthlyIncome - this.profile.totalMonthlyBills;
    
    if (surplus <= 0) return 0;

    // Spara 3-5% av överskottet osynligt
    const savingsRate = 0.04; // 4%
    const suggestedSavings = Math.round(surplus * savingsRate);

    // Max 500 kr/månad för att vara "osynligt"
    return Math.min(500, suggestedSavings);
  }

  private projectAnnualSavings(monthlyAmount: number): number {
    // Enkel projektion utan ränta
    return monthlyAmount * 12;
  }

  private getLastContribution(): Date {
    const deposits = this.savingsHistory.filter(tx => tx.type === 'deposit');
    if (deposits.length === 0) return new Date();
    
    return deposits.reduce((latest, tx) => 
      tx.date > latest ? tx.date : latest
    , deposits[0].date);
  }

  private isSystemActive(): boolean {
    // Aktiv om användaren har marginal och vi kan spara
    return this.calculateMonthlyContribution() > 0;
  }

  /**
   * Föreslå dagens mikro-sparande
   */
  public suggestDailySaving(): {
    amount: number;
    safe: boolean;
    message: string;
  } {
    const monthlyTarget = this.calculateMonthlyContribution();
    const dailyTarget = Math.round(monthlyTarget / 30);

    // Kolla om det är säkert att spara idag
    const upcomingBills = this.getUpcomingBillsAmount(7);
    const availableBuffer = this.profile.currentBalance - upcomingBills - 1000;

    if (availableBuffer < dailyTarget) {
      return {
        amount: 0,
        safe: false,
        message: 'VUE pausar osynligt sparande - kommande utgifter prioriteras.',
      };
    }

    return {
      amount: dailyTarget,
      safe: true,
      message: `Reserverar ${dailyTarget} kr till din osynliga buffert.`,
    };
  }

  private getUpcomingBillsAmount(days: number): number {
    const now = new Date();
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.bills
      .filter(bill => 
        bill.status !== 'paid' && 
        bill.dueDate >= now && 
        bill.dueDate <= cutoff
      )
      .reduce((sum, bill) => sum + bill.amount, 0);
  }

  /**
   * Registrera en sparande-transaktion
   */
  public recordTransaction(amount: number, type: 'deposit' | 'withdrawal', reason: string): void {
    this.savingsHistory.push({
      date: new Date(),
      amount,
      type,
      reason,
    });
  }

  /**
   * Använd buffert vid nödsituation
   */
  public useEmergencyBuffer(amount: number): {
    success: boolean;
    withdrawn: number;
    remaining: number;
    message: string;
  } {
    const currentBuffer = this.calculateCurrentBuffer();
    const maxWithdrawal = Math.min(amount, currentBuffer);

    if (maxWithdrawal <= 0) {
      return {
        success: false,
        withdrawn: 0,
        remaining: 0,
        message: 'Ingen buffert tillgänglig.',
      };
    }

    this.recordTransaction(maxWithdrawal, 'withdrawal', 'Nöduttag');

    return {
      success: true,
      withdrawn: maxWithdrawal,
      remaining: currentBuffer - maxWithdrawal,
      message: `${maxWithdrawal} kr har tagits från din osynliga buffert.`,
    };
  }

  private calculateConfidence(): number {
    const monthsOfData = this.savingsHistory.length;
    if (monthsOfData >= 6) return 85;
    if (monthsOfData >= 3) return 70;
    return 55;
  }

  private assessDataQuality(): 'Låg' | 'Medel' | 'Hög' {
    const confidence = this.calculateConfidence();
    if (confidence >= 80) return 'Hög';
    if (confidence >= 60) return 'Medel';
    return 'Låg';
  }

  /**
   * Få motiverande sammanfattning
   */
  public getSummary(): string {
    const analysis = this.analyze();
    
    if (!analysis.isActive) {
      return 'Osynligt sparande är pausat tills din ekonomi har mer marginal.';
    }

    if (analysis.currentBuffer > 0) {
      return `Din osynliga buffert är nu ${analysis.currentBuffer.toLocaleString('sv-SE')} kr. Du sparar ca ${analysis.monthlyContribution} kr/månad utan att märka det.`;
    }

    return `VUE sparar ${analysis.monthlyContribution} kr/månad osynligt åt dig.`;
  }
}
