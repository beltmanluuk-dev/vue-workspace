/**
 * SubscriptionDetectionEngine
 * Identifierar prenumerationer, dubbletter och oanvända abonnemang
 */

import { Bill } from '../../types';
import {
  SubscriptionAnalysis,
  UserFinancialProfile,
} from '../types';

interface UsageData {
  vendor: string;
  lastUsed: Date | null;
  usageFrequency: number; // 0-100
}

export class SubscriptionDetectionEngine {
  private bills: Bill[];
  private usageData: Map<string, UsageData>;

  constructor(bills: Bill[], usageData?: UsageData[]) {
    this.bills = bills;
    this.usageData = new Map();
    
    // Initialisera användningsdata
    if (usageData) {
      usageData.forEach(data => this.usageData.set(data.vendor, data));
    }
  }

  /**
   * Analysera alla prenumerationer
   */
  public analyze(): SubscriptionAnalysis[] {
    const subscriptions = this.bills.filter(
      bill => bill.category === 'subscription'
    );

    const analyses: SubscriptionAnalysis[] = [];

    subscriptions.forEach(sub => {
      const analysis = this.analyzeSubscription(sub, subscriptions);
      analyses.push(analysis);
    });

    // Sortera efter potentiella besparingar
    return analyses.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  private analyzeSubscription(
    subscription: Bill,
    allSubscriptions: Bill[]
  ): SubscriptionAnalysis {
    const usageScore = this.calculateUsageScore(subscription);
    const duplicate = this.findDuplicate(subscription, allSubscriptions);
    const recommendation = this.generateRecommendation(usageScore, duplicate);
    const annualCost = subscription.amount * 12;
    const potentialSavings = this.calculatePotentialSavings(
      subscription,
      usageScore,
      duplicate
    );

    return {
      subscriptionId: subscription.id,
      vendor: subscription.vendor,
      monthlyAmount: subscription.amount,
      usageScore,
      isDuplicate: duplicate !== null,
      duplicateOf: duplicate?.vendor,
      recommendation,
      annualCost,
      potentialSavings,
      confidenceScore: this.calculateConfidence(subscription),
      dataQuality: this.usageData.has(subscription.vendor) ? 'Hög' : 'Låg',
      lastUpdated: new Date(),
    };
  }

  private calculateUsageScore(subscription: Bill): number {
    const usage = this.usageData.get(subscription.vendor);
    
    if (!usage) {
      // Utan användningsdata, anta medelhög användning
      return 50;
    }

    // Basera på frekvens och senaste användning
    const frequencyScore = usage.usageFrequency;
    
    if (usage.lastUsed) {
      const daysSinceUse = Math.floor(
        (new Date().getTime() - usage.lastUsed.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Minska score om inte använd på länge
      if (daysSinceUse > 30) {
        return Math.max(0, frequencyScore - 30);
      }
      if (daysSinceUse > 14) {
        return Math.max(0, frequencyScore - 15);
      }
    }

    return frequencyScore;
  }

  private findDuplicate(
    subscription: Bill,
    allSubscriptions: Bill[]
  ): Bill | null {
    // Definiera kategorier av liknande tjänster
    const serviceCategories: Record<string, string[]> = {
      streaming_video: ['Netflix', 'HBO Max', 'Disney+', 'Viaplay', 'Amazon Prime', 'Apple TV+'],
      streaming_music: ['Spotify', 'Apple Music', 'Tidal', 'YouTube Music', 'Deezer'],
      cloud_storage: ['iCloud', 'Google One', 'Dropbox', 'OneDrive'],
      fitness: ['SATS', 'Nordic Wellness', 'Friskis', 'Fitness24Seven'],
      news: ['DN', 'SvD', 'Aftonbladet', 'Expressen', 'GP'],
    };

    // Hitta vilken kategori denna prenumeration tillhör
    let subscriptionCategory: string | null = null;
    for (const [category, vendors] of Object.entries(serviceCategories)) {
      if (vendors.some(v => subscription.vendor.toLowerCase().includes(v.toLowerCase()))) {
        subscriptionCategory = category;
        break;
      }
    }

    if (!subscriptionCategory) return null;

    // Hitta andra prenumerationer i samma kategori
    const categoryVendors = serviceCategories[subscriptionCategory];
    const duplicates = allSubscriptions.filter(
      other =>
        other.id !== subscription.id &&
        categoryVendors.some(v => 
          other.vendor.toLowerCase().includes(v.toLowerCase())
        )
    );

    return duplicates.length > 0 ? duplicates[0] : null;
  }

  private generateRecommendation(
    usageScore: number,
    duplicate: Bill | null
  ): 'Behåll' | 'Granska' | 'Avsluta' {
    if (duplicate) {
      return 'Granska'; // Dubbletter bör alltid granskas
    }
    
    if (usageScore < 20) {
      return 'Avsluta';
    }
    
    if (usageScore < 50) {
      return 'Granska';
    }
    
    return 'Behåll';
  }

  private calculatePotentialSavings(
    subscription: Bill,
    usageScore: number,
    duplicate: Bill | null
  ): number {
    const annualCost = subscription.amount * 12;
    
    if (duplicate) {
      // Vid dubbletter, spara hela kostnaden för en
      return annualCost;
    }
    
    if (usageScore < 20) {
      // Oanvänd tjänst, spara hela kostnaden
      return annualCost;
    }
    
    if (usageScore < 50) {
      // Låg användning, potentiell besparing genom nedgradering
      return Math.round(annualCost * 0.5);
    }
    
    return 0;
  }

  private calculateConfidence(subscription: Bill): number {
    const hasUsageData = this.usageData.has(subscription.vendor);
    return hasUsageData ? 85 : 55;
  }

  /**
   * Få totala potentiella besparingar
   */
  public getTotalPotentialSavings(): number {
    const analyses = this.analyze();
    return analyses.reduce((sum, a) => sum + a.potentialSavings, 0);
  }

  /**
   * Få prenumerationer som verkar oanvända
   */
  public getUnusedSubscriptions(): SubscriptionAnalysis[] {
    return this.analyze().filter(a => a.usageScore < 30);
  }

  /**
   * Generera användarvänlig sammanfattning
   */
  public getSummary(): string {
    const analyses = this.analyze();
    const unused = analyses.filter(a => a.recommendation === 'Avsluta');
    const toReview = analyses.filter(a => a.recommendation === 'Granska');
    const totalSavings = this.getTotalPotentialSavings();

    if (unused.length === 0 && toReview.length === 0) {
      return 'Alla dina prenumerationer verkar användas aktivt.';
    }

    let summary = '';
    if (unused.length > 0) {
      summary += `${unused.length} prenumeration${unused.length > 1 ? 'er' : ''} verkar sällan användas. `;
    }
    if (toReview.length > 0) {
      summary += `${toReview.length} prenumeration${toReview.length > 1 ? 'er' : ''} bör granskas. `;
    }
    if (totalSavings > 0) {
      summary += `Du kan spara upp till ${totalSavings.toLocaleString('sv-SE')} kr/år.`;
    }

    return summary;
  }
}
