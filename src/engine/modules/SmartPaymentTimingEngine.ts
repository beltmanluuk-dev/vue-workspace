/**
 * SmartPaymentTimingEngine
 * Analyserar lönecykler och optimerar betalningsdatum
 */

import { Bill } from '../../types';
import {
  PaymentOptimization,
  UserFinancialProfile,
} from '../types';

export class SmartPaymentTimingEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Analysera och optimera betalningsdatum för alla fakturor
   */
  public analyze(): PaymentOptimization[] {
    const optimizations: PaymentOptimization[] = [];

    this.bills
      .filter(bill => bill.status !== 'paid')
      .forEach(bill => {
        const optimization = this.analyzePaymentTiming(bill);
        if (optimization) {
          optimizations.push(optimization);
        }
      });

    // Sortera efter prioritet
    return optimizations.sort((a, b) => {
      const priorityOrder = { 'Kritisk': 0, 'Hög': 1, 'Medel': 2, 'Låg': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private analyzePaymentTiming(bill: Bill): PaymentOptimization | null {
    const currentDate = new Date(bill.dueDate);
    const optimalDate = this.calculateOptimalDate(bill);
    
    // Endast föreslå ändring om det finns en fördel
    if (this.isSameDate(currentDate, optimalDate)) {
      return null;
    }

    const daysDiff = this.getDaysDiff(currentDate, optimalDate);
    const savings = this.estimateSavings(bill, daysDiff);

    return {
      billId: bill.id,
      currentDate,
      suggestedDate: optimalDate,
      reason: this.generateReason(bill, daysDiff),
      savings,
      priority: this.determinePriority(bill, daysDiff),
      confidenceScore: this.calculateConfidence(bill),
      dataQuality: 'Medel',
      lastUpdated: new Date(),
    };
  }

  private calculateOptimalDate(bill: Bill): Date {
    const payday = this.profile.incomeDay;
    const currentDueDate = new Date(bill.dueDate);
    const currentDay = currentDueDate.getDate();
    
    // Optimalt: 3-5 dagar efter lön för kritiska utgifter
    // 7-10 dagar efter lön för vanliga utgifter
    const isHighPriority = bill.category === 'rent' || bill.category === 'insurance';
    const optimalDayOffset = isHighPriority ? 3 : 7;
    
    let optimalDay = payday + optimalDayOffset;
    if (optimalDay > 28) optimalDay = 28; // Undvik problem med korta månader

    // Om fakturan redan är nära optimalt, behåll den
    if (Math.abs(currentDay - optimalDay) <= 2) {
      return currentDueDate;
    }

    // Beräkna nytt datum
    const optimalDate = new Date(currentDueDate);
    optimalDate.setDate(optimalDay);

    // Om det nya datumet är tidigare, flytta till nästa månad
    if (optimalDate < new Date()) {
      optimalDate.setMonth(optimalDate.getMonth() + 1);
    }

    return optimalDate;
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private getDaysDiff(date1: Date, date2: Date): number {
    const diffTime = date2.getTime() - date1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  private estimateSavings(bill: Bill, daysDiff: number): number {
    // Uppskatta besparingar baserat på:
    // - Undvika förseningsavgifter (ca 60 kr per försenad faktura)
    // - Bättre ränta på kontot under extra dagar
    // - Minskad risk för övertrassering
    
    if (daysDiff > 0) {
      // Flytta senare = pengar stannar längre på kontot
      const interestSavings = (bill.amount * 0.02 * daysDiff) / 365;
      return Math.round(interestSavings);
    }
    
    // Flytta tidigare för att undvika stress/förseningar
    return 0;
  }

  private generateReason(bill: Bill, daysDiff: number): string {
    if (daysDiff > 0) {
      return `Flytta betalning ${daysDiff} dagar senare för bättre kassaflöde.`;
    }
    if (daysDiff < 0) {
      return `Flytta betalning ${Math.abs(daysDiff)} dagar tidigare för att undvika stress nära lönedag.`;
    }
    return 'Optimalt datum för denna betalning.';
  }

  private determinePriority(bill: Bill, daysDiff: number): 'Låg' | 'Medel' | 'Hög' | 'Kritisk' {
    // Prioritera baserat på fakturakategori och storlek
    if (bill.category === 'rent') return 'Kritisk';
    if (bill.category === 'insurance') return 'Hög';
    if (bill.amount > 2000) return 'Medel';
    return 'Låg';
  }

  private calculateConfidence(bill: Bill): number {
    // Högre konfidens för fakturor med mer historik
    const historyEntries = this.profile.paymentHistory.filter(
      p => p.vendor === bill.vendor
    ).length;
    
    if (historyEntries >= 6) return 90;
    if (historyEntries >= 3) return 75;
    return 60;
  }

  /**
   * Få rekommenderad betalningsordning för kommande vecka
   */
  public getPaymentPriority(): Bill[] {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.bills
      .filter(bill => 
        bill.status !== 'paid' && 
        bill.dueDate >= now && 
        bill.dueDate <= nextWeek
      )
      .sort((a, b) => {
        // Prioritera: rent > insurance > utilities > subscription > other
        const priorityMap: Record<string, number> = {
          rent: 0,
          insurance: 1,
          utilities: 2,
          subscription: 3,
          other: 4,
        };
        return priorityMap[a.category] - priorityMap[b.category];
      });
  }
}
