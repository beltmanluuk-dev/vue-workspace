/**
 * FinancialStressEngine
 * Beräknar ekonomisk stress 0-100 baserat på flera faktorer
 */

import { Bill } from '../../types';
import {
  StressAnalysis,
  StressFactor,
  RiskLevel,
  UserFinancialProfile,
} from '../types';

export class FinancialStressEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Huvudanalys - returnerar komplett stressanalys
   */
  public analyze(): StressAnalysis {
    const factors = this.calculateFactors();
    const stressScore = this.calculateStressScore(factors);
    const riskLevel = this.determineRiskLevel(stressScore);
    const recommendation = this.generateRecommendation(stressScore, factors);

    return {
      stressScore,
      riskLevel,
      factors,
      recommendation,
      confidenceScore: this.calculateConfidence(),
      dataQuality: this.assessDataQuality(),
      lastUpdated: new Date(),
    };
  }

  private calculateFactors(): StressFactor[] {
    const factors: StressFactor[] = [];

    // Faktor 1: Inkomst vs utgifter
    const incomeRatio = this.profile.totalMonthlyBills / this.profile.monthlyIncome;
    factors.push({
      type: 'income',
      impact: Math.min(100, incomeRatio * 100),
      description: incomeRatio > 0.7 
        ? 'Höga utgifter i förhållande till inkomst'
        : incomeRatio > 0.5 
          ? 'Balanserade utgifter'
          : 'God marginal mellan inkomst och utgifter',
    });

    // Faktor 2: Kommande fakturor (nästa 7 dagar)
    const upcomingBills = this.getUpcomingBillsAmount(7);
    const upcomingRatio = upcomingBills / this.profile.currentBalance;
    factors.push({
      type: 'bills',
      impact: Math.min(100, upcomingRatio * 80),
      description: upcomingRatio > 0.8
        ? 'Många fakturor förfaller snart'
        : upcomingRatio > 0.5
          ? 'Några fakturor på väg'
          : 'Få fakturor närmaste dagarna',
    });

    // Faktor 3: Nuvarande saldo
    const balanceBuffer = this.profile.currentBalance - this.profile.totalMonthlyBills;
    const balanceScore = balanceBuffer < 0 ? 100 : Math.max(0, 100 - (balanceBuffer / 1000) * 10);
    factors.push({
      type: 'balance',
      impact: balanceScore,
      description: balanceBuffer < 0
        ? 'Saldot täcker inte kommande utgifter'
        : balanceBuffer < 5000
          ? 'Begränsad buffert'
          : 'God buffert på kontot',
    });

    // Faktor 4: Historiska dippar (försenade betalningar)
    const latePayments = this.profile.paymentHistory.filter(p => !p.wasOnTime).length;
    const lateRatio = latePayments / Math.max(1, this.profile.paymentHistory.length);
    factors.push({
      type: 'history',
      impact: lateRatio * 100,
      description: lateRatio > 0.2
        ? 'Flera försenade betalningar historiskt'
        : lateRatio > 0.1
          ? 'Enstaka förseningar'
          : 'Bra betalningshistorik',
    });

    // Faktor 5: Timing (dagar till lön)
    const daysToPayday = this.getDaysToPayday();
    const timingScore = daysToPayday > 20 ? 60 : daysToPayday > 10 ? 30 : 10;
    factors.push({
      type: 'timing',
      impact: timingScore,
      description: daysToPayday > 20
        ? 'Lång tid kvar till nästa lön'
        : daysToPayday > 10
          ? 'Halva månaden kvar till lön'
          : 'Lönen kommer snart',
    });

    return factors;
  }

  private calculateStressScore(factors: StressFactor[]): number {
    // Viktad summa av alla faktorer
    const weights = {
      income: 0.25,
      bills: 0.25,
      balance: 0.30,
      history: 0.10,
      timing: 0.10,
    };

    let totalScore = 0;
    factors.forEach(factor => {
      totalScore += factor.impact * (weights[factor.type] || 0.2);
    });

    return Math.round(Math.min(100, Math.max(0, totalScore)));
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 80) return 'Kritisk';
    if (score >= 60) return 'Hög';
    if (score >= 30) return 'Medel';
    return 'Låg';
  }

  private generateRecommendation(score: number, factors: StressFactor[]): string {
    if (score >= 80) {
      return 'Din ekonomi är under press. VUE rekommenderar att pausa icke-kritiska utgifter.';
    }
    if (score >= 60) {
      return 'Var uppmärksam på kommande utgifter. Överväg att skjuta upp större köp.';
    }
    if (score >= 30) {
      return 'Din ekonomi är stabil men med begränsad buffert.';
    }
    return 'Din ekonomi är i gott skick. Perfekt läge för långsiktigt sparande.';
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

  private getDaysToPayday(): number {
    const now = new Date();
    const currentDay = now.getDate();
    const payday = this.profile.incomeDay;
    
    if (currentDay <= payday) {
      return payday - currentDay;
    }
    // Räkna dagar till nästa månad
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return daysInMonth - currentDay + payday;
  }

  private calculateConfidence(): number {
    const historyLength = this.profile.paymentHistory.length;
    if (historyLength >= 12) return 95;
    if (historyLength >= 6) return 80;
    if (historyLength >= 3) return 65;
    return 50;
  }

  private assessDataQuality(): 'Låg' | 'Medel' | 'Hög' {
    const confidence = this.calculateConfidence();
    if (confidence >= 80) return 'Hög';
    if (confidence >= 60) return 'Medel';
    return 'Låg';
  }
}
