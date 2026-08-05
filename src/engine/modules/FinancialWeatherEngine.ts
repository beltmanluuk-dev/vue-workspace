/**
 * FinancialWeatherEngine
 * Genererar ekonomiskt väder baserat på finansiell status
 */

import { Bill } from '../../types';
import {
  WeatherForecast,
  FinancialWeather,
  UserFinancialProfile,
} from '../types';

export class FinancialWeatherEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Generera väderprogons för ekonomin
   */
  public analyze(): WeatherForecast {
    const current = this.assessCurrentWeather();
    const forecast7Days = this.forecast(7);
    const forecast30Days = this.forecast(30);
    const summary = this.generateSummary(current, forecast7Days, forecast30Days);

    return {
      current,
      forecast7Days,
      forecast30Days,
      summary,
      icon: this.getWeatherIcon(current),
      confidenceScore: this.calculateConfidence(),
      dataQuality: this.assessDataQuality(),
      lastUpdated: new Date(),
    };
  }

  private assessCurrentWeather(): FinancialWeather {
    const balanceRatio = this.profile.currentBalance / this.profile.monthlyIncome;
    const billsPendingRatio = this.getUpcomingBillsAmount(7) / this.profile.currentBalance;

    // Stormigt om saldot inte täcker kommande utgifter
    if (balanceRatio < 0.2 || billsPendingRatio > 1) {
      return 'stormy';
    }

    // Molnigt om det blir tight
    if (balanceRatio < 0.4 || billsPendingRatio > 0.7) {
      return 'cloudy';
    }

    // Delvis molnigt om marginalen är okej
    if (balanceRatio < 0.6 || billsPendingRatio > 0.5) {
      return 'partly_cloudy';
    }

    // Soligt om allt ser bra ut
    return 'sunny';
  }

  private forecast(daysAhead: number): FinancialWeather {
    // Simulera saldo om X dagar
    const upcomingBills = this.getUpcomingBillsAmount(daysAhead);
    const expectedIncome = this.getExpectedIncome(daysAhead);
    const projectedBalance = this.profile.currentBalance - upcomingBills + expectedIncome;

    const projectedRatio = projectedBalance / this.profile.monthlyIncome;

    if (projectedRatio < 0) {
      return 'stormy';
    }
    if (projectedRatio < 0.3) {
      return 'cloudy';
    }
    if (projectedRatio < 0.5) {
      return 'partly_cloudy';
    }
    return 'sunny';
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

  private getExpectedIncome(daysAhead: number): number {
    const now = new Date();
    const currentDay = now.getDate();
    const payday = this.profile.incomeDay;

    // Kolla om lönedag inträffar inom perioden
    if (currentDay < payday && payday <= currentDay + daysAhead) {
      return this.profile.monthlyIncome;
    }

    // Om daysAhead är mer än en månad, räkna med en lön
    if (daysAhead >= 30) {
      return this.profile.monthlyIncome;
    }

    return 0;
  }

  private generateSummary(
    current: FinancialWeather,
    forecast7: FinancialWeather,
    forecast30: FinancialWeather
  ): string {
    const weatherDescriptions: Record<FinancialWeather, string> = {
      sunny: 'stabilt',
      partly_cloudy: 'med viss osäkerhet',
      cloudy: 'under press',
      stormy: 'i riskzon',
    };

    if (current === 'sunny' && forecast7 === 'sunny') {
      return 'Ekonomiskt lugnt väder. Inga stormar i sikte.';
    }

    if (current === 'stormy') {
      return 'Ekonomisk storm pågår. VUE aktiverar skyddsåtgärder.';
    }

    if (forecast7 === 'stormy' || forecast30 === 'stormy') {
      return `Just nu ${weatherDescriptions[current]}, men utmaningar väntar. Förbered dig.`;
    }

    return `Ekonomin är ${weatherDescriptions[current]}. ${this.getWeatherAdvice(current)}`;
  }

  private getWeatherAdvice(weather: FinancialWeather): string {
    switch (weather) {
      case 'sunny':
        return 'Perfekt tid för sparande.';
      case 'partly_cloudy':
        return 'Håll koll på kommande utgifter.';
      case 'cloudy':
        return 'Var försiktig med nya utgifter.';
      case 'stormy':
        return 'Fokusera på det nödvändigaste.';
    }
  }

  private getWeatherIcon(weather: FinancialWeather): string {
    switch (weather) {
      case 'sunny':
        return '☀️';
      case 'partly_cloudy':
        return '🌤️';
      case 'cloudy':
        return '☁️';
      case 'stormy':
        return '⛈️';
    }
  }

  private calculateConfidence(): number {
    const billCount = this.bills.length;
    const historyLength = this.profile.paymentHistory.length;
    
    const billConfidence = Math.min(50, billCount * 5);
    const historyConfidence = Math.min(50, historyLength * 5);
    
    return billConfidence + historyConfidence;
  }

  private assessDataQuality(): 'Låg' | 'Medel' | 'Hög' {
    const confidence = this.calculateConfidence();
    if (confidence >= 80) return 'Hög';
    if (confidence >= 50) return 'Medel';
    return 'Låg';
  }

  /**
   * Få kort väderrapport för dashboard
   */
  public getQuickForecast(): { icon: string; text: string } {
    const analysis = this.analyze();
    return {
      icon: analysis.icon,
      text: analysis.summary,
    };
  }
}
