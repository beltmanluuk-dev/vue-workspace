/**
 * PassiveLeakDetectionEngine
 * Hittar små prisökningar och beräknar årsförlust
 */

import { Bill } from '../../types';
import {
  PassiveLeak,
  PriceIncrease,
  UserFinancialProfile,
} from '../types';

export class PassiveLeakDetectionEngine {
  private bills: Bill[];
  private paymentHistory: UserFinancialProfile['paymentHistory'];

  constructor(bills: Bill[], paymentHistory: UserFinancialProfile['paymentHistory']) {
    this.bills = bills;
    this.paymentHistory = paymentHistory;
  }

  /**
   * Analysera alla fakturor för passiva läckor
   */
  public analyze(): PassiveLeak[] {
    const leaks: PassiveLeak[] = [];

    this.bills.forEach(bill => {
      const leak = this.detectLeak(bill);
      if (leak) {
        leaks.push(leak);
      }
    });

    // Sortera efter årsförlust
    return leaks.sort((a, b) => b.totalAnnualLoss - a.totalAnnualLoss);
  }

  private detectLeak(bill: Bill): PassiveLeak | null {
    const priceIncreases = this.findPriceIncreases(bill);
    
    if (priceIncreases.length === 0) {
      return null;
    }

    const totalAnnualLoss = this.calculateAnnualLoss(priceIncreases);
    const recommendation = this.generateRecommendation(bill, totalAnnualLoss);

    return {
      billId: bill.id,
      vendor: bill.vendor,
      priceIncreases,
      totalAnnualLoss,
      recommendation,
      confidenceScore: this.calculateConfidence(priceIncreases),
      dataQuality: priceIncreases.length >= 3 ? 'Hög' : 'Medel',
      lastUpdated: new Date(),
    };
  }

  private findPriceIncreases(bill: Bill): PriceIncrease[] {
    // Hämta betalningshistorik för denna leverantör
    const vendorHistory = this.paymentHistory
      .filter(p => p.vendor === bill.vendor)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (vendorHistory.length < 2) {
      return [];
    }

    const increases: PriceIncrease[] = [];

    for (let i = 1; i < vendorHistory.length; i++) {
      const previous = vendorHistory[i - 1];
      const current = vendorHistory[i];

      if (current.amount > previous.amount) {
        const percentageIncrease = 
          ((current.amount - previous.amount) / previous.amount) * 100;

        // Endast rapportera om ökningen är mellan 1% och 30%
        // (för stora ökningar är sannolikt faktiska fakturor, inte smygökningar)
        if (percentageIncrease >= 1 && percentageIncrease <= 30) {
          increases.push({
            date: current.date,
            previousAmount: previous.amount,
            newAmount: current.amount,
            percentageIncrease: Math.round(percentageIncrease * 10) / 10,
          });
        }
      }
    }

    return increases;
  }

  private calculateAnnualLoss(priceIncreases: PriceIncrease[]): number {
    if (priceIncreases.length === 0) return 0;

    // Beräkna total ökning från första till senaste
    const firstPrice = priceIncreases[0].previousAmount;
    const lastPrice = priceIncreases[priceIncreases.length - 1].newAmount;
    const monthlyIncrease = lastPrice - firstPrice;

    // Extrapolera till årsförlust (12 månader)
    return Math.round(monthlyIncrease * 12);
  }

  private generateRecommendation(bill: Bill, annualLoss: number): string {
    if (annualLoss > 1000) {
      return `Du förlorar cirka ${annualLoss.toLocaleString('sv-SE')} kr/år på smygande prisökningar. Kontakta ${bill.vendor} för att förhandla priset.`;
    }
    
    if (annualLoss > 500) {
      return `Priserna hos ${bill.vendor} har ökat gradvis. Överväg att jämföra med alternativ.`;
    }
    
    return `Mindre prisökningar hos ${bill.vendor}. Håll koll på framtida ändringar.`;
  }

  private calculateConfidence(priceIncreases: PriceIncrease[]): number {
    // Mer historik = högre konfidens
    if (priceIncreases.length >= 4) return 90;
    if (priceIncreases.length >= 2) return 75;
    return 60;
  }

  /**
   * Få total årsförlust från alla läckor
   */
  public getTotalAnnualLoss(): number {
    const leaks = this.analyze();
    return leaks.reduce((sum, leak) => sum + leak.totalAnnualLoss, 0);
  }

  /**
   * Få sammanfattning för användaren
   */
  public getSummary(): string {
    const leaks = this.analyze();
    const totalLoss = this.getTotalAnnualLoss();

    if (leaks.length === 0) {
      return 'Inga smygande prisökningar upptäckta.';
    }

    return `${leaks.length} faktura${leaks.length > 1 ? 'or' : ''} har haft prisökningar. Total förlust: ${totalLoss.toLocaleString('sv-SE')} kr/år.`;
  }
}
