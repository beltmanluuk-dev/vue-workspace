/**
 * ConfidenceEngine
 * Beräknar och validerar confidenceScore för alla AI-analyser
 */

import { Bill } from '../../types';
import {
  ConfidenceResult,
  UserFinancialProfile,
} from '../types';

export interface ConfidenceFactors {
  dataCompleteness: number; // 0-100
  dataRecency: number; // 0-100
  historicalAccuracy: number; // 0-100
  sampleSize: number; // 0-100
}

export class ConfidenceEngine {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Beräkna övergripande konfidens för en analys
   */
  public calculateConfidence(analysisType: string): ConfidenceResult {
    const factors = this.assessFactors(analysisType);
    const score = this.computeWeightedScore(factors);
    const quality = this.determineDataQuality(score);

    return {
      confidenceScore: score,
      dataQuality: quality,
      lastUpdated: new Date(),
    };
  }

  private assessFactors(analysisType: string): ConfidenceFactors {
    return {
      dataCompleteness: this.assessDataCompleteness(),
      dataRecency: this.assessDataRecency(),
      historicalAccuracy: this.assessHistoricalAccuracy(analysisType),
      sampleSize: this.assessSampleSize(),
    };
  }

  private assessDataCompleteness(): number {
    let score = 0;
    const maxScore = 100;

    // Har vi inkomstdata?
    if (this.profile.monthlyIncome > 0) score += 25;
    
    // Har vi saldodata?
    if (this.profile.currentBalance !== undefined) score += 25;
    
    // Har vi tillräckligt med fakturor?
    if (this.bills.length >= 5) score += 25;
    else score += (this.bills.length / 5) * 25;
    
    // Har vi betalningshistorik?
    if (this.profile.paymentHistory.length >= 10) score += 25;
    else score += (this.profile.paymentHistory.length / 10) * 25;

    return Math.min(maxScore, Math.round(score));
  }

  private assessDataRecency(): number {
    const now = new Date();
    const history = this.profile.paymentHistory;

    if (history.length === 0) return 30;

    // Hitta senaste betalning
    const latestPayment = history.reduce((latest, p) => 
      p.date > latest.date ? p : latest
    );

    const daysSinceLatest = Math.floor(
      (now.getTime() - latestPayment.date.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Ju mer nyligen, desto högre score
    if (daysSinceLatest <= 7) return 100;
    if (daysSinceLatest <= 14) return 85;
    if (daysSinceLatest <= 30) return 70;
    if (daysSinceLatest <= 60) return 50;
    return 30;
  }

  private assessHistoricalAccuracy(analysisType: string): number {
    // I framtiden kan vi spåra hur ofta våra prediktioner stämmer
    // För nu, använd en baslinjekonfidens baserad på datavolym
    const historyLength = this.profile.paymentHistory.length;

    if (historyLength >= 24) return 90; // 2+ år av data
    if (historyLength >= 12) return 80; // 1+ år
    if (historyLength >= 6) return 70; // 6+ månader
    if (historyLength >= 3) return 55; // 3+ månader
    return 40;
  }

  private assessSampleSize(): number {
    const billCount = this.bills.length;
    const historyCount = this.profile.paymentHistory.length;
    const totalSamples = billCount + historyCount;

    if (totalSamples >= 50) return 100;
    if (totalSamples >= 30) return 85;
    if (totalSamples >= 15) return 70;
    if (totalSamples >= 5) return 50;
    return 30;
  }

  private computeWeightedScore(factors: ConfidenceFactors): number {
    // Vikter för olika faktorer
    const weights = {
      dataCompleteness: 0.30,
      dataRecency: 0.25,
      historicalAccuracy: 0.25,
      sampleSize: 0.20,
    };

    const score = 
      factors.dataCompleteness * weights.dataCompleteness +
      factors.dataRecency * weights.dataRecency +
      factors.historicalAccuracy * weights.historicalAccuracy +
      factors.sampleSize * weights.sampleSize;

    return Math.round(score);
  }

  private determineDataQuality(score: number): 'Låg' | 'Medel' | 'Hög' {
    if (score >= 75) return 'Hög';
    if (score >= 50) return 'Medel';
    return 'Låg';
  }

  /**
   * Validera om vi har tillräckligt med data för en viss analys
   */
  public canPerformAnalysis(analysisType: string, minConfidence: number = 40): boolean {
    const confidence = this.calculateConfidence(analysisType);
    return confidence.confidenceScore >= minConfidence;
  }

  /**
   * Få detaljerad konfidensrapport
   */
  public getDetailedReport(): {
    factors: ConfidenceFactors;
    overall: ConfidenceResult;
    recommendations: string[];
  } {
    const factors = this.assessFactors('general');
    const overall = this.calculateConfidence('general');
    const recommendations = this.generateRecommendations(factors);

    return { factors, overall, recommendations };
  }

  private generateRecommendations(factors: ConfidenceFactors): string[] {
    const recommendations: string[] = [];

    if (factors.dataCompleteness < 70) {
      recommendations.push('Lägg till fler fakturor för bättre analyser.');
    }
    if (factors.dataRecency < 70) {
      recommendations.push('Uppdatera din betalningshistorik för mer aktuella insikter.');
    }
    if (factors.sampleSize < 70) {
      recommendations.push('Mer data behövs för pålitligare prognoser.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Din datakvalitet är utmärkt för pålitliga analyser.');
    }

    return recommendations;
  }
}
