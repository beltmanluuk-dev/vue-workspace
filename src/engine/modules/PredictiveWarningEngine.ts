/**
 * PredictiveWarningEngine
 * Simulerar saldo 30 dagar framåt och varnar innan negativ balans
 */

import { Bill } from '../../types';
import {
  PredictiveWarning,
  BalanceForecast,
  RiskLevel,
  UserFinancialProfile,
} from '../types';

export class PredictiveWarningEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];
  private forecastDays: number;

  constructor(
    profile: UserFinancialProfile,
    bills: Bill[],
    forecastDays: number = 30
  ) {
    this.profile = profile;
    this.bills = bills;
    this.forecastDays = forecastDays;
  }

  /**
   * Generera varningar för kommande ekonomiska risker
   */
  public analyze(): PredictiveWarning[] {
    const forecasts = this.generateBalanceForecasts();
    const warnings: PredictiveWarning[] = [];

    // Hitta första dagen med negativ balans
    const firstNegativeDay = forecasts.find(f => f.isNegative);
    
    if (firstNegativeDay) {
      const daysUntil = this.getDaysBetween(new Date(), firstNegativeDay.date);
      
      warnings.push({
        daysUntilRisk: daysUntil,
        predictedBalance: firstNegativeDay.predictedBalance,
        warningMessage: this.generateWarningMessage(daysUntil, firstNegativeDay.predictedBalance),
        severity: this.determineSeverity(daysUntil),
        suggestedActions: this.generateSuggestedActions(daysUntil, firstNegativeDay),
        confidenceScore: this.calculateConfidence(daysUntil),
        dataQuality: this.assessDataQuality(),
        lastUpdated: new Date(),
      });
    }

    // Lägg till varningar för stora utgiftsdagar
    const highExpenseDays = forecasts.filter(f => 
      f.scheduledOutflows > this.profile.monthlyIncome * 0.3
    );

    highExpenseDays.forEach(day => {
      const daysUntil = this.getDaysBetween(new Date(), day.date);
      if (daysUntil > 0 && daysUntil <= 14) {
        warnings.push({
          daysUntilRisk: daysUntil,
          predictedBalance: day.predictedBalance,
          warningMessage: `Stora utgifter på ${day.scheduledOutflows.toLocaleString('sv-SE')} kr väntas om ${daysUntil} dagar.`,
          severity: 'Medel',
          suggestedActions: [
            'Se över om några betalningar kan flyttas',
            'Säkerställ att saldot räcker',
          ],
          confidenceScore: this.calculateConfidence(daysUntil),
          dataQuality: this.assessDataQuality(),
          lastUpdated: new Date(),
        });
      }
    });

    return warnings;
  }

  /**
   * Generera daglig saldoprognos
   */
  public generateBalanceForecasts(): BalanceForecast[] {
    const forecasts: BalanceForecast[] = [];
    let runningBalance = this.profile.currentBalance;
    const now = new Date();

    for (let i = 0; i <= this.forecastDays; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Beräkna utgående betalningar denna dag
      const outflows = this.getScheduledOutflows(date);
      
      // Beräkna förväntade inkomster (lön)
      const inflows = this.getExpectedInflows(date);
      
      runningBalance = runningBalance - outflows + inflows;

      forecasts.push({
        date,
        predictedBalance: Math.round(runningBalance),
        scheduledOutflows: outflows,
        expectedInflows: inflows,
        isNegative: runningBalance < 0,
      });
    }

    return forecasts;
  }

  private getScheduledOutflows(date: Date): number {
    return this.bills
      .filter(bill => {
        if (bill.status === 'paid') return false;
        const billDate = new Date(bill.dueDate);
        return (
          billDate.getFullYear() === date.getFullYear() &&
          billDate.getMonth() === date.getMonth() &&
          billDate.getDate() === date.getDate()
        );
      })
      .reduce((sum, bill) => sum + bill.amount, 0);
  }

  private getExpectedInflows(date: Date): number {
    // Anta att lön kommer på incomeDay varje månad
    if (date.getDate() === this.profile.incomeDay) {
      return this.profile.monthlyIncome;
    }
    return 0;
  }

  private getDaysBetween(start: Date, end: Date): number {
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private generateWarningMessage(daysUntil: number, predictedBalance: number): string {
    if (daysUntil <= 3) {
      return `Varning: Om ${daysUntil} dagar riskerar ditt saldo bli ${Math.abs(predictedBalance).toLocaleString('sv-SE')} kr negativt.`;
    }
    if (daysUntil <= 7) {
      return `Om ${daysUntil} dagar kan ditt saldo bli negativt. Planera dina utgifter.`;
    }
    return `Om ${daysUntil} dagar riskerar ditt saldo bli negativt. Du har tid att agera.`;
  }

  private determineSeverity(daysUntil: number): RiskLevel {
    if (daysUntil <= 3) return 'Kritisk';
    if (daysUntil <= 7) return 'Hög';
    if (daysUntil <= 14) return 'Medel';
    return 'Låg';
  }

  private generateSuggestedActions(daysUntil: number, forecast: BalanceForecast): string[] {
    const actions: string[] = [];

    if (daysUntil <= 7) {
      actions.push('Skjut upp icke-kritiska betalningar');
      actions.push('Aktivera ekonomiskt nödläge');
    }
    
    if (forecast.scheduledOutflows > 0) {
      actions.push('Granska kommande fakturor');
    }

    actions.push('Kontakta leverantörer för betalningsanstånd');
    
    return actions;
  }

  private calculateConfidence(daysAhead: number): number {
    // Konfidens minskar ju längre fram vi prognostiserar
    const baseConfidence = 90;
    const decayPerDay = 2;
    return Math.max(50, baseConfidence - (daysAhead * decayPerDay));
  }

  private assessDataQuality(): 'Låg' | 'Medel' | 'Hög' {
    const billCount = this.bills.length;
    if (billCount >= 10) return 'Hög';
    if (billCount >= 5) return 'Medel';
    return 'Låg';
  }
}
