/**
 * EconomicShockAbsorber
 * Hanterar oväntade ekonomiska händelser genom att schemalägga om och aktivera buffert
 */

import { Bill } from '../../types';
import {
  ShockAbsorberAction,
  UserFinancialProfile,
  RiskLevel,
} from '../types';

export type ShockEvent = 'unexpected_expense' | 'income_loss' | 'emergency' | 'large_bill';

export interface ShockAnalysis {
  event: ShockEvent;
  severity: RiskLevel;
  actions: ShockAbsorberAction[];
  totalProtected: number;
  message: string;
  confidenceScore: number;
}

export class EconomicShockAbsorber {
  private profile: UserFinancialProfile;
  private bills: Bill[];

  constructor(profile: UserFinancialProfile, bills: Bill[]) {
    this.profile = profile;
    this.bills = bills;
  }

  /**
   * Aktivera shock absorber vid oväntad händelse
   */
  public activate(event: ShockEvent, impactAmount: number): ShockAnalysis {
    const severity = this.assessSeverity(impactAmount);
    const actions = this.generateActions(event, impactAmount, severity);
    const totalProtected = this.calculateProtectedAmount(actions);

    return {
      event,
      severity,
      actions,
      totalProtected,
      message: this.generateMessage(event, severity, totalProtected),
      confidenceScore: this.calculateConfidence(actions),
    };
  }

  private assessSeverity(impactAmount: number): RiskLevel {
    const ratio = impactAmount / this.profile.monthlyIncome;
    
    if (ratio >= 0.5) return 'Kritisk';
    if (ratio >= 0.3) return 'Hög';
    if (ratio >= 0.15) return 'Medel';
    return 'Låg';
  }

  private generateActions(
    event: ShockEvent,
    impactAmount: number,
    severity: RiskLevel
  ): ShockAbsorberAction[] {
    const actions: ShockAbsorberAction[] = [];
    let remainingImpact = impactAmount;

    // 1. Aktivera sparad buffert om tillgänglig
    if (this.profile.savingsBalance > 0) {
      const bufferUse = Math.min(this.profile.savingsBalance * 0.5, remainingImpact);
      actions.push({
        type: 'buffer',
        description: `Aktivera ${bufferUse.toLocaleString('sv-SE')} kr från buffert`,
        priority: 1,
        autoExecute: severity === 'Kritisk',
      });
      remainingImpact -= bufferUse;
    }

    // 2. Pausa lågprioriterade betalningar
    if (remainingImpact > 0) {
      const pausableBills = this.getPausableBills();
      
      for (const bill of pausableBills) {
        if (remainingImpact <= 0) break;
        
        actions.push({
          type: 'pause',
          billId: bill.id,
          description: `Pausa ${bill.vendor} (${bill.amount.toLocaleString('sv-SE')} kr)`,
          priority: 2,
          autoExecute: false,
        });
        remainingImpact -= bill.amount;
      }
    }

    // 3. Schemalägga om betalningar
    if (remainingImpact > 0) {
      const reschedulableBills = this.getReschedulableBills();
      
      for (const bill of reschedulableBills) {
        if (remainingImpact <= 0) break;
        
        actions.push({
          type: 'reschedule',
          billId: bill.id,
          description: `Skjut upp ${bill.vendor} med 14 dagar`,
          priority: 3,
          autoExecute: false,
        });
        remainingImpact -= bill.amount * 0.5; // Partiell lättnad
      }
    }

    // 4. Notifiera användaren
    actions.push({
      type: 'notify',
      description: this.getNotificationMessage(event, severity),
      priority: 0,
      autoExecute: true,
    });

    return actions.sort((a, b) => a.priority - b.priority);
  }

  private getPausableBills(): Bill[] {
    // Prioritera pausing av prenumerationer och icke-kritiska utgifter
    return this.bills
      .filter(bill => 
        bill.status !== 'paid' &&
        bill.category === 'subscription'
      )
      .sort((a, b) => a.amount - b.amount);
  }

  private getReschedulableBills(): Bill[] {
    // Fakturor som kan skjutas upp utan stora konsekvenser
    return this.bills
      .filter(bill => 
        bill.status !== 'paid' &&
        bill.category !== 'rent' &&
        bill.category !== 'insurance'
      )
      .sort((a, b) => b.amount - a.amount);
  }

  private calculateProtectedAmount(actions: ShockAbsorberAction[]): number {
    let total = 0;
    
    actions.forEach(action => {
      if (action.billId) {
        const bill = this.bills.find(b => b.id === action.billId);
        if (bill) {
          total += action.type === 'pause' ? bill.amount : bill.amount * 0.5;
        }
      }
    });

    return Math.round(total);
  }

  private generateMessage(
    event: ShockEvent,
    severity: RiskLevel,
    totalProtected: number
  ): string {
    const eventMessages: Record<ShockEvent, string> = {
      unexpected_expense: 'oväntad utgift',
      income_loss: 'inkomstbortfall',
      emergency: 'nödsituation',
      large_bill: 'stor faktura',
    };

    if (severity === 'Kritisk') {
      return `VUE har aktiverat ekonomiskt nödläge på grund av ${eventMessages[event]}. ${totalProtected.toLocaleString('sv-SE')} kr har skyddats.`;
    }

    return `VUE föreslår justeringar för att hantera ${eventMessages[event]}. Potentiellt skydd: ${totalProtected.toLocaleString('sv-SE')} kr.`;
  }

  private getNotificationMessage(event: ShockEvent, severity: RiskLevel): string {
    if (severity === 'Kritisk') {
      return 'Ekonomiskt nödläge aktiverat. Granska föreslagna åtgärder.';
    }
    return 'VUE har identifierat en ekonomisk utmaning och förbereder åtgärder.';
  }

  private calculateConfidence(actions: ShockAbsorberAction[]): number {
    // Konfidens baserad på hur väl vi kan hantera situationen
    const executableActions = actions.filter(a => a.type !== 'notify').length;
    return Math.min(90, 50 + executableActions * 10);
  }

  /**
   * Simulera effekten av att aktivera alla föreslagna åtgärder
   */
  public simulateRecovery(analysis: ShockAnalysis): {
    newBalance: number;
    recoveryDays: number;
    riskReduction: number;
  } {
    const newBalance = this.profile.currentBalance + analysis.totalProtected;
    const recoveryDays = Math.ceil(analysis.totalProtected / (this.profile.monthlyIncome / 30));
    const riskReduction = Math.min(100, (analysis.totalProtected / this.profile.monthlyIncome) * 100);

    return {
      newBalance,
      recoveryDays,
      riskReduction: Math.round(riskReduction),
    };
  }
}
