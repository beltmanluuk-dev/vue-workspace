/**
 * MoneyMomentumEngine
 * Visar ekonomisk riktning och trend
 */

import { Bill } from '../../types';
import {
  MomentumAnalysis,
  MoneyMomentum,
  UserFinancialProfile,
} from '../types';

export class MoneyMomentumEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Analysera ekonomisk momentum
   */
  public analyze(): MomentumAnalysis {
    const trend = this.calculateTrend();
    const momentum = this.determineMomentum(trend);
    const weekChange = this.calculateWeekOverWeekChange();
    const monthChange = this.calculateMonthOverMonthChange();
    const insight = this.generateInsight(momentum, trend);

    return {
      momentum,
      trend,
      weekOverWeekChange: weekChange,
      monthOverMonthChange: monthChange,
      insight,
      confidenceScore: this.calculateConfidence(),
      dataQuality: this.assessDataQuality(),
      lastUpdated: new Date(),
    };
  }

  private calculateTrend(): number {
    // Trend beräknas som skillnad mellan inkomster och utgifter över tid
    // Positivt = förbättring, Negativt = försämring
    const recentPayments = this.profile.paymentHistory.slice(-10);
    
    if (recentPayments.length < 3) {
      return 0; // Inte tillräckligt med data
    }

    // Beräkna genomsnittlig utgift per period
    const totalExpenses = recentPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgExpense = totalExpenses / recentPayments.length;

    // Jämför med förväntad månadskostnad
    const expectedMonthly = this.profile.totalMonthlyBills;
    const expenseRatio = avgExpense / (expectedMonthly / recentPayments.length);

    // Konvertera till trend (-100 till +100)
    if (expenseRatio > 1.2) {
      return Math.max(-100, -((expenseRatio - 1) * 100));
    }
    if (expenseRatio < 0.8) {
      return Math.min(100, ((1 - expenseRatio) * 100));
    }
    
    return 0;
  }

  private determineMomentum(trend: number): MoneyMomentum {
    if (trend >= 20) return 'Förbättras';
    if (trend <= -20) return 'Ökad risk';
    if (trend > -10 && trend < 10) return 'Neutral';
    return 'Stabiliseras';
  }

  private calculateWeekOverWeekChange(): number {
    const history = this.profile.paymentHistory;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = history
      .filter(p => p.date >= oneWeekAgo && p.date <= now)
      .reduce((sum, p) => sum + p.amount, 0);

    const lastWeek = history
      .filter(p => p.date >= twoWeeksAgo && p.date < oneWeekAgo)
      .reduce((sum, p) => sum + p.amount, 0);

    if (lastWeek === 0) return 0;
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  }

  private calculateMonthOverMonthChange(): number {
    const history = this.profile.paymentHistory;
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const thisMonth = history
      .filter(p => p.date >= oneMonthAgo && p.date <= now)
      .reduce((sum, p) => sum + p.amount, 0);

    const lastMonth = history
      .filter(p => p.date >= twoMonthsAgo && p.date < oneMonthAgo)
      .reduce((sum, p) => sum + p.amount, 0);

    if (lastMonth === 0) return 0;
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  }

  private generateInsight(momentum: MoneyMomentum, trend: number): string {
    switch (momentum) {
      case 'Förbättras':
        return 'Din ekonomi utvecklas positivt. Fortsätt på samma spår!';
      case 'Stabiliseras':
        return 'Din ekonomi stabiliseras. Inga omedelbara åtgärder krävs.';
      case 'Neutral':
        return 'Din ekonomi är i balans. Perfekt läge för framtidsplanering.';
      case 'Ökad risk':
        return 'Ekonomisk varning. Granska kommande utgifter och överväg justeringar.';
      default:
        return 'Analyserar din ekonomi...';
    }
  }

  private calculateConfidence(): number {
    const historyLength = this.profile.paymentHistory.length;
    if (historyLength >= 20) return 90;
    if (historyLength >= 10) return 75;
    if (historyLength >= 5) return 60;
    return 45;
  }

  private assessDataQuality(): 'Låg' | 'Medel' | 'Hög' {
    const confidence = this.calculateConfidence();
    if (confidence >= 80) return 'Hög';
    if (confidence >= 60) return 'Medel';
    return 'Låg';
  }

  /**
   * Få kort statustext för dashboard
   */
  public getStatusText(): string {
    const analysis = this.analyze();
    return analysis.momentum;
  }

  /**
   * Få trendindikator för UI
   */
  public getTrendIndicator(): 'up' | 'down' | 'stable' {
    const analysis = this.analyze();
    if (analysis.trend > 10) return 'up';
    if (analysis.trend < -10) return 'down';
    return 'stable';
  }
}
