/**
 * OpportunityEngine
 * Identifierar säkra spenderingsperioder
 */

import { Bill } from '../../types';
import {
  SpendingOpportunity,
  UserFinancialProfile,
} from '../types';

export class OpportunityEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Analysera om det finns säkert utrymme för större köp
   */
  public analyze(): SpendingOpportunity {
    const availableAmount = this.calculateSafeSpendingAmount();
    const safeToSpend = availableAmount > 0;
    const nextRiskDate = this.findNextRiskDate();
    const recommendation = this.generateRecommendation(availableAmount, safeToSpend);

    return {
      availableAmount,
      safeToSpend,
      nextRiskDate,
      recommendation,
      confidenceScore: this.calculateConfidence(),
      dataQuality: this.assessDataQuality(),
      lastUpdated: new Date(),
    };
  }

  private calculateSafeSpendingAmount(): number {
    // Beräkna säkert belopp att spendera
    // Saldo - kommande fakturor - buffert
    const upcomingBills = this.getUpcomingBillsAmount(30);
    const safetyBuffer = this.profile.monthlyIncome * 0.15; // 15% buffert
    
    const available = this.profile.currentBalance - upcomingBills - safetyBuffer;
    
    return Math.max(0, Math.round(available));
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

  private findNextRiskDate(): Date {
    const now = new Date();
    let runningBalance = this.profile.currentBalance;
    
    // Simulera framåt dag för dag
    for (let i = 0; i <= 60; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Dra av fakturor som förfaller denna dag
      const dailyBills = this.bills.filter(bill => {
        if (bill.status === 'paid') return false;
        const billDate = new Date(bill.dueDate);
        return (
          billDate.getFullYear() === date.getFullYear() &&
          billDate.getMonth() === date.getMonth() &&
          billDate.getDate() === date.getDate()
        );
      });

      dailyBills.forEach(bill => {
        runningBalance -= bill.amount;
      });

      // Lägg till lön om det är lönedag
      if (date.getDate() === this.profile.incomeDay) {
        runningBalance += this.profile.monthlyIncome;
      }

      // Om saldot blir under 20% av månadsinkomst, det är en riskdag
      if (runningBalance < this.profile.monthlyIncome * 0.2) {
        return date;
      }
    }

    // Ingen risk inom 60 dagar
    return new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  }

  private generateRecommendation(availableAmount: number, safeToSpend: boolean): string {
    if (!safeToSpend) {
      return 'Just nu rekommenderar VUE att undvika större köp. Vänta tills efter nästa lön.';
    }

    if (availableAmount > 5000) {
      return `Du har utrymme för större köp denna månad. Upp till ${availableAmount.toLocaleString('sv-SE')} kr är säkert att spendera.`;
    }

    if (availableAmount > 2000) {
      return `Du har visst utrymme för extra utgifter. ${availableAmount.toLocaleString('sv-SE')} kr kan spenderas utan risk.`;
    }

    return `Begränsat utrymme: ${availableAmount.toLocaleString('sv-SE')} kr tillgängligt för extra utgifter.`;
  }

  private calculateConfidence(): number {
    const billAccuracy = this.bills.length >= 5 ? 40 : this.bills.length * 8;
    const historyAccuracy = Math.min(40, this.profile.paymentHistory.length * 4);
    const balanceAccuracy = 20; // Antar aktuellt saldo är korrekt
    
    return billAccuracy + historyAccuracy + balanceAccuracy;
  }

  private assessDataQuality(): 'Låg' | 'Medel' | 'Hög' {
    const confidence = this.calculateConfidence();
    if (confidence >= 80) return 'Hög';
    if (confidence >= 50) return 'Medel';
    return 'Låg';
  }

  /**
   * Snabbkontroll: Kan jag köpa något för X kr?
   */
  public canAfford(amount: number): { safe: boolean; message: string } {
    const analysis = this.analyze();
    
    if (amount <= analysis.availableAmount) {
      return {
        safe: true,
        message: `Ja, du kan köpa detta. Du har ${(analysis.availableAmount - amount).toLocaleString('sv-SE')} kr kvar efteråt.`,
      };
    }

    return {
      safe: false,
      message: `VUE rekommenderar att vänta. Du skulle behöva ${(amount - analysis.availableAmount).toLocaleString('sv-SE')} kr mer för att göra detta köp säkert.`,
    };
  }
}
