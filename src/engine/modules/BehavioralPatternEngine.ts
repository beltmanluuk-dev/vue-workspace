/**
 * BehavioralPatternEngine
 * Identifierar spenderingscykler och beteendemönster
 */

import { Bill } from '../../types';
import {
  BehavioralPattern,
  UserFinancialProfile,
} from '../types';

type PatternType = 'post_salary' | 'weekend' | 'seasonal' | 'impulse' | 'planned';

export class BehavioralPatternEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Analysera alla beteendemönster
   */
  public analyze(): BehavioralPattern[] {
    const patterns: BehavioralPattern[] = [];

    // Analysera olika typer av mönster
    const postSalary = this.analyzePostSalaryPattern();
    if (postSalary) patterns.push(postSalary);

    const weekend = this.analyzeWeekendPattern();
    if (weekend) patterns.push(weekend);

    const seasonal = this.analyzeSeasonalPattern();
    if (seasonal) patterns.push(seasonal);

    const impulse = this.analyzeImpulsePattern();
    if (impulse) patterns.push(impulse);

    return patterns;
  }

  private analyzePostSalaryPattern(): BehavioralPattern | null {
    const history = this.profile.paymentHistory;
    const payday = this.profile.incomeDay;

    // Hitta betalningar inom 5 dagar efter lön
    const postSalaryPayments = history.filter(p => {
      const dayOfMonth = p.date.getDate();
      return dayOfMonth >= payday && dayOfMonth <= payday + 5;
    });

    if (postSalaryPayments.length < 3) return null;

    const totalAmount = postSalaryPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgAmount = totalAmount / postSalaryPayments.length;
    const frequency = (postSalaryPayments.length / history.length) * 100;

    return {
      patternType: 'post_salary',
      frequency: Math.round(frequency),
      averageAmount: Math.round(avgAmount),
      description: 'Ökade utgifter direkt efter lön.',
      suggestion: this.getPostSalarySuggestion(frequency, avgAmount),
      confidenceScore: this.calculateConfidence(postSalaryPayments.length),
      dataQuality: this.assessDataQuality(postSalaryPayments.length),
      lastUpdated: new Date(),
    };
  }

  private analyzeWeekendPattern(): BehavioralPattern | null {
    const history = this.profile.paymentHistory;

    // Hitta betalningar på helger (lördag = 6, söndag = 0)
    const weekendPayments = history.filter(p => {
      const dayOfWeek = p.date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    });

    // Förväntat: ~28% av betalningar på helg (2/7 dagar)
    const weekendRatio = weekendPayments.length / history.length;
    if (weekendRatio <= 0.35 || weekendPayments.length < 3) return null;

    const totalAmount = weekendPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgAmount = totalAmount / weekendPayments.length;

    return {
      patternType: 'weekend',
      frequency: Math.round(weekendRatio * 100),
      averageAmount: Math.round(avgAmount),
      description: 'Högre utgifter på helger.',
      suggestion: 'Planera helgaktiviteter i förväg för bättre kontroll.',
      confidenceScore: this.calculateConfidence(weekendPayments.length),
      dataQuality: this.assessDataQuality(weekendPayments.length),
      lastUpdated: new Date(),
    };
  }

  private analyzeSeasonalPattern(): BehavioralPattern | null {
    const history = this.profile.paymentHistory;
    if (history.length < 12) return null; // Behöver minst ett års data

    // Gruppera betalningar per månad
    const monthlyTotals = new Map<number, number[]>();
    
    history.forEach(p => {
      const month = p.date.getMonth();
      const existing = monthlyTotals.get(month) || [];
      existing.push(p.amount);
      monthlyTotals.set(month, existing);
    });

    // Hitta månader med avvikande höga utgifter
    const monthlyAverages: number[] = [];
    monthlyTotals.forEach((amounts, month) => {
      const avg = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
      monthlyAverages.push(avg);
    });

    const overallAvg = monthlyAverages.reduce((sum, a) => sum + a, 0) / monthlyAverages.length;
    const highMonths = monthlyAverages.filter(avg => avg > overallAvg * 1.3);

    if (highMonths.length === 0) return null;

    return {
      patternType: 'seasonal',
      frequency: Math.round((highMonths.length / 12) * 100),
      averageAmount: Math.round(overallAvg),
      description: 'Säsongsmässig variation i utgifter.',
      suggestion: 'Förbered dig för högsäsonger genom att spara i lugnare perioder.',
      confidenceScore: this.calculateConfidence(history.length),
      dataQuality: this.assessDataQuality(history.length),
      lastUpdated: new Date(),
    };
  }

  private analyzeImpulsePattern(): BehavioralPattern | null {
    const history = this.profile.paymentHistory;
    
    // Identifiera "ovanliga" betalningar (inte till kända leverantörer)
    const knownVendors = new Set(this.bills.map(b => b.vendor));
    const unknownPayments = history.filter(p => !knownVendors.has(p.vendor));

    if (unknownPayments.length < 3) return null;

    const totalAmount = unknownPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgAmount = totalAmount / unknownPayments.length;
    const frequency = (unknownPayments.length / history.length) * 100;

    // Endast rapportera om det är en betydande del
    if (frequency < 20) return null;

    return {
      patternType: 'impulse',
      frequency: Math.round(frequency),
      averageAmount: Math.round(avgAmount),
      description: 'Oplanerade utgifter utanför fasta kostnader.',
      suggestion: 'Sätt en månatlig budget för spontana köp.',
      confidenceScore: this.calculateConfidence(unknownPayments.length),
      dataQuality: this.assessDataQuality(unknownPayments.length),
      lastUpdated: new Date(),
    };
  }

  private getPostSalarySuggestion(frequency: number, avgAmount: number): string {
    if (frequency > 50) {
      return 'Du tenderar att spendera mycket direkt efter lön. Överväg att automatisera sparande samma dag som lönen kommer.';
    }
    return 'Viss ökning av utgifter efter lön är normalt. Fortsätt hålla koll.';
  }

  private calculateConfidence(sampleSize: number): number {
    if (sampleSize >= 20) return 90;
    if (sampleSize >= 10) return 75;
    if (sampleSize >= 5) return 60;
    return 45;
  }

  private assessDataQuality(sampleSize: number): 'Låg' | 'Medel' | 'Hög' {
    const confidence = this.calculateConfidence(sampleSize);
    if (confidence >= 80) return 'Hög';
    if (confidence >= 60) return 'Medel';
    return 'Låg';
  }

  /**
   * Få sammanfattning av beteendemönster
   */
  public getSummary(): string {
    const patterns = this.analyze();
    
    if (patterns.length === 0) {
      return 'Inga tydliga spenderingsmönster identifierade ännu.';
    }

    const topPattern = patterns[0];
    return `VUE har identifierat ${patterns.length} beteendemönster. Mest framträdande: ${topPattern.description}`;
  }
}
