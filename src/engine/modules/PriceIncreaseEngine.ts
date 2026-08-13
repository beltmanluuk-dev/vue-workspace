/**
 * PriceIncreaseEngine (Prisbevakaren)
 * Detekterar oväntade prisökningar på prenumerationer och tjänster
 * Del av VUE Clarity Engine
 */

import { Bill } from '../../types';
import {
  PriceIncreaseAlert,
  PriceIncreaseEngineState,
  PriceIncreaseConfig,
  HistoricalPrice,
  PriceAlertSeverity,
  UserFinancialProfile,
  DEFAULT_PRICE_INCREASE_CONFIG,
} from '../types';

export class PriceIncreaseEngine {
  private bills: Bill[];
  private paymentHistory: UserFinancialProfile['paymentHistory'];
  private config: PriceIncreaseConfig;
  private alertHistory: PriceIncreaseAlert[] = [];

  constructor(
    bills: Bill[],
    paymentHistory: UserFinancialProfile['paymentHistory'],
    config: Partial<PriceIncreaseConfig> = {}
  ) {
    this.bills = bills;
    this.paymentHistory = paymentHistory;
    this.config = { ...DEFAULT_PRICE_INCREASE_CONFIG, ...config };
  }

  /**
   * Kör full analys och returnera alla prisökningsvarningar
   */
  public analyze(): PriceIncreaseEngineState {
    const alerts: PriceIncreaseAlert[] = [];

    this.bills.forEach(bill => {
      const alert = this.detectPriceIncrease(bill);
      if (alert) {
        alerts.push(alert);
      }
    });

    // Sortera efter allvarlighetsgrad och procentuell ökning
    const sortedAlerts = alerts.sort((a, b) => {
      const severityOrder = { significant: 3, moderate: 2, minor: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.percentageChange - a.percentageChange;
    });

    const totalAnnualImpact = this.calculateTotalAnnualImpact(sortedAlerts);
    const potentialSavings = this.calculatePotentialSavings(sortedAlerts);

    return {
      alerts: sortedAlerts,
      totalAnnualImpact,
      potentialSavings,
      lastScan: new Date(),
      alertHistory: this.alertHistory,
    };
  }

  /**
   * Detektera prisökning för en specifik faktura
   */
  private detectPriceIncrease(bill: Bill): PriceIncreaseAlert | null {
    const vendorHistory = this.getVendorHistory(bill.vendor);
    
    if (vendorHistory.length < 2) {
      return null;
    }

    // Hämta senaste 3 månadernas historik för jämförelse
    const recentHistory = this.getRecentHistory(vendorHistory, this.config.monthsToAnalyze);
    
    if (recentHistory.length < 2) {
      return null;
    }

    // Beräkna genomsnitt av tidigare betalningar (exkl. senaste)
    const previousPayments = recentHistory.slice(0, -1);
    const latestPayment = recentHistory[recentHistory.length - 1];
    
    const averageAmount = this.calculateAverage(previousPayments.map(p => p.amount));
    const priceChange = latestPayment.amount - averageAmount;
    const percentageChange = (priceChange / averageAmount) * 100;

    // Kontrollera om detta är en engångsbetalning
    if (this.config.ignoreOneTimePurchases && this.isOneTimePurchase(bill, vendorHistory)) {
      return null;
    }

    // Kontrollera tröskelvärden
    const exceedsPercentageThreshold = percentageChange >= this.config.percentageThreshold;
    const exceedsAbsoluteThreshold = priceChange >= this.config.absoluteThreshold;

    if (!exceedsPercentageThreshold && !exceedsAbsoluteThreshold) {
      return null;
    }

    // Skapa varning
    const severity = this.determineSeverity(percentageChange, priceChange);
    const historicalPrices = this.buildHistoricalPrices(vendorHistory);
    const annualImpact = Math.round(priceChange * 12);

    return {
      id: `price-alert-${bill.id}`,
      vendor: bill.vendor,
      vendorLogo: bill.logo,
      category: bill.category as 'subscription' | 'utilities' | 'insurance' | 'other',
      previousPrice: Math.round(averageAmount * 100) / 100,
      newPrice: latestPayment.amount,
      priceChange: Math.round(priceChange * 100) / 100,
      percentageChange: Math.round(percentageChange * 10) / 10,
      severity,
      isRecurring: this.isRecurringService(vendorHistory),
      detectedAt: new Date(),
      historicalPrices,
      annualImpact,
      recommendation: this.generateRecommendation(bill, percentageChange, annualImpact),
      status: 'pending',
      confidenceScore: this.calculateConfidence(vendorHistory),
      dataQuality: vendorHistory.length >= 6 ? 'Hög' : vendorHistory.length >= 3 ? 'Medel' : 'Låg',
      lastUpdated: new Date(),
    };
  }

  /**
   * Hämta betalningshistorik för en leverantör
   */
  private getVendorHistory(vendor: string): UserFinancialProfile['paymentHistory'] {
    return this.paymentHistory
      .filter(p => p.vendor.toLowerCase() === vendor.toLowerCase())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Hämta de senaste N månadernas historik
   */
  private getRecentHistory(
    history: UserFinancialProfile['paymentHistory'],
    months: number
  ): UserFinancialProfile['paymentHistory'] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    return history.filter(p => p.date >= cutoffDate);
  }

  /**
   * Beräkna genomsnitt
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Avgör om det är ett engångsköp
   */
  private isOneTimePurchase(
    bill: Bill,
    history: UserFinancialProfile['paymentHistory']
  ): boolean {
    // Om det bara finns 1-2 betalningar, kan vara engångsköp
    if (history.length <= 2) {
      return true;
    }

    // Kolla om beloppen varierar kraftigt (>50% variation)
    const amounts = history.map(p => p.amount);
    const avg = this.calculateAverage(amounts);
    const variance = amounts.reduce((sum, a) => sum + Math.pow(a - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avg) * 100;

    // Hög variation tyder på engångsköp eller variabla tjänster
    return coefficientOfVariation > 50;
  }

  /**
   * Avgör allvarlighetsgrad baserat på prisökning
   */
  private determineSeverity(percentageChange: number, absoluteChange: number): PriceAlertSeverity {
    if (percentageChange >= 15 || absoluteChange >= 100) {
      return 'significant';
    }
    if (percentageChange >= 7 || absoluteChange >= 50) {
      return 'moderate';
    }
    return 'minor';
  }

  /**
   * Avgör om det är en återkommande tjänst
   */
  private isRecurringService(history: UserFinancialProfile['paymentHistory']): boolean {
    if (history.length < 3) return false;

    // Kolla om betalningarna sker regelbundet (ungefär varje månad)
    const intervals: number[] = [];
    for (let i = 1; i < history.length; i++) {
      const daysDiff = Math.round(
        (history[i].date.getTime() - history[i - 1].date.getTime()) / (1000 * 60 * 60 * 24)
      );
      intervals.push(daysDiff);
    }

    const avgInterval = this.calculateAverage(intervals);
    // Månatlig = ~30 dagar, veckovis = ~7 dagar, årlig = ~365 dagar
    return avgInterval >= 25 && avgInterval <= 35;
  }

  /**
   * Bygg historisk prislista
   */
  private buildHistoricalPrices(history: UserFinancialProfile['paymentHistory']): HistoricalPrice[] {
    return history.slice(-6).map(p => ({
      date: p.date,
      amount: p.amount,
    }));
  }

  /**
   * Generera rekommendation baserat på prisökning
   */
  private generateRecommendation(
    bill: Bill,
    percentageChange: number,
    annualImpact: number
  ): string {
    if (percentageChange >= 15) {
      return `${bill.vendor} har höjt priset markant (${Math.round(percentageChange)}%). Det kostar dig ${annualImpact.toLocaleString('sv-SE')} kr extra per år. Överväg att byta leverantör eller förhandla.`;
    }
    
    if (percentageChange >= 7) {
      return `Prisökning på ${Math.round(percentageChange)}% hos ${bill.vendor}. Jämför med alternativ för att potentiellt spara ${annualImpact.toLocaleString('sv-SE')} kr/år.`;
    }

    return `Mindre prisändring hos ${bill.vendor}. Årlig påverkan: ${annualImpact.toLocaleString('sv-SE')} kr.`;
  }

  /**
   * Beräkna konfidensnivå baserat på datahistorik
   */
  private calculateConfidence(history: UserFinancialProfile['paymentHistory']): number {
    if (history.length >= 12) return 95;
    if (history.length >= 6) return 85;
    if (history.length >= 3) return 70;
    return 50;
  }

  /**
   * Beräkna total årlig påverkan från alla varningar
   */
  private calculateTotalAnnualImpact(alerts: PriceIncreaseAlert[]): number {
    return alerts.reduce((sum, alert) => sum + alert.annualImpact, 0);
  }

  /**
   * Beräkna potentiella besparingar om användaren agerar
   */
  private calculatePotentialSavings(alerts: PriceIncreaseAlert[]): number {
    // Anta att användaren kan spara 70% av prisökningarna genom att agera
    const totalImpact = this.calculateTotalAnnualImpact(alerts);
    return Math.round(totalImpact * 0.7);
  }

  /**
   * Uppdatera status på en varning
   */
  public updateAlertStatus(
    alertId: string,
    status: PriceIncreaseAlert['status']
  ): void {
    const alertIndex = this.alertHistory.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.alertHistory[alertIndex].status = status;
    }
  }

  /**
   * Få sammanfattning för användaren
   */
  public getSummary(): string {
    const state = this.analyze();
    
    if (state.alerts.length === 0) {
      return 'Inga prisökningar upptäckta. Dina prenumerationer är stabila.';
    }

    const significant = state.alerts.filter(a => a.severity === 'significant').length;
    const moderate = state.alerts.filter(a => a.severity === 'moderate').length;

    if (significant > 0) {
      return `⚠️ ${significant} betydande prisökning${significant > 1 ? 'ar' : ''} upptäckt${significant > 1 ? 'a' : ''}. Total årlig påverkan: ${state.totalAnnualImpact.toLocaleString('sv-SE')} kr.`;
    }

    if (moderate > 0) {
      return `${moderate} prisändring${moderate > 1 ? 'ar' : ''} upptäckt${moderate > 1 ? 'a' : ''}. Du kan spara upp till ${state.potentialSavings.toLocaleString('sv-SE')} kr/år.`;
    }

    return `${state.alerts.length} mindre prisändring${state.alerts.length > 1 ? 'ar' : ''} noterad${state.alerts.length > 1 ? 'e' : ''}.`;
  }

  /**
   * Hämta aktiva varningar (ej godkända/avvisade)
   */
  public getPendingAlerts(): PriceIncreaseAlert[] {
    return this.analyze().alerts.filter(a => a.status === 'pending');
  }
}
