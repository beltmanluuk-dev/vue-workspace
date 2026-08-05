/**
 * FinancialModesSystem
 * Hanterar automatisk växling mellan ekonomiska lägen
 */

import { Bill } from '../../types';
import {
  FinancialMode,
  FinancialModeState,
  ModeTransition,
  UserFinancialProfile,
} from '../types';

export interface ModeConfig {
  mode: FinancialMode;
  description: string;
  actions: string[];
  thresholds: {
    stressScore: { min: number; max: number };
    balanceRatio: { min: number; max: number };
  };
}

export class FinancialModesSystem {
  private profile: UserFinancialProfile;
  private bills: Bill[];
  private currentMode: FinancialMode;
  private modeHistory: ModeTransition[];
  private autoSwitchEnabled: boolean;

  private static readonly MODE_CONFIGS: ModeConfig[] = [
    {
      mode: 'Stabilitet',
      description: 'Fokus på att hålla ekonomin stabil och förutsägbar.',
      actions: ['Betala fakturor i tid', 'Undvik nya utgifter', 'Bygg buffert'],
      thresholds: {
        stressScore: { min: 0, max: 30 },
        balanceRatio: { min: 0.6, max: 1.0 },
      },
    },
    {
      mode: 'Optimering',
      description: 'Ekonomin är stark - dags att optimera och spara mer.',
      actions: ['Öka sparande', 'Granska prenumerationer', 'Sök bättre avtal'],
      thresholds: {
        stressScore: { min: 0, max: 20 },
        balanceRatio: { min: 0.8, max: 2.0 },
      },
    },
    {
      mode: 'Återhämtning',
      description: 'Fokus på att återställa ekonomin efter utmaning.',
      actions: ['Pausa icke-kritiska utgifter', 'Prioritera nödvändigt', 'Aktivera buffert'],
      thresholds: {
        stressScore: { min: 60, max: 100 },
        balanceRatio: { min: 0, max: 0.3 },
      },
    },
    {
      mode: 'Övergång',
      description: 'Ekonomin går igenom förändring - extra uppmärksamhet.',
      actions: ['Granska alla utgifter', 'Planera för förändring', 'Justera budget'],
      thresholds: {
        stressScore: { min: 30, max: 60 },
        balanceRatio: { min: 0.3, max: 0.6 },
      },
    },
    {
      mode: 'Familj',
      description: 'Familjeläge aktiverat - delad ekonomisk översikt.',
      actions: ['Synka med familjemedlemmar', 'Gemensam budget', 'Delade mål'],
      thresholds: {
        stressScore: { min: 0, max: 100 },
        balanceRatio: { min: 0, max: 2.0 },
      },
    },
  ];

  constructor(
    profile: UserFinancialProfile,
    bills: Bill[],
    initialMode: FinancialMode = 'Stabilitet',
    autoSwitch: boolean = true
  ) {
    this.profile = profile;
    this.bills = bills;
    this.currentMode = initialMode;
    this.modeHistory = [];
    this.autoSwitchEnabled = autoSwitch;
  }

  /**
   * Analysera och föreslå lämpligt läge
   */
  public analyze(stressScore: number): FinancialModeState {
    const balanceRatio = this.calculateBalanceRatio();
    const suggestedMode = this.determineBestMode(stressScore, balanceRatio);

    // Auto-växla om aktiverat och läget skiljer sig
    if (this.autoSwitchEnabled && suggestedMode !== this.currentMode) {
      this.switchMode(suggestedMode, `Automatisk växling baserat på ekonomisk status`);
    }

    return {
      currentMode: this.currentMode,
      suggestedMode,
      autoSwitchEnabled: this.autoSwitchEnabled,
      modeHistory: this.modeHistory,
    };
  }

  private calculateBalanceRatio(): number {
    if (this.profile.monthlyIncome === 0) return 0;
    return this.profile.currentBalance / this.profile.monthlyIncome;
  }

  private determineBestMode(stressScore: number, balanceRatio: number): FinancialMode {
    // Prioritera lägen baserat på trösklar
    for (const config of FinancialModesSystem.MODE_CONFIGS) {
      if (config.mode === 'Familj') continue; // Familj är manuellt aktiverat

      const stressMatch = 
        stressScore >= config.thresholds.stressScore.min &&
        stressScore <= config.thresholds.stressScore.max;

      const balanceMatch =
        balanceRatio >= config.thresholds.balanceRatio.min &&
        balanceRatio <= config.thresholds.balanceRatio.max;

      if (stressMatch && balanceMatch) {
        return config.mode;
      }
    }

    return 'Stabilitet'; // Default
  }

  /**
   * Växla till ett nytt läge
   */
  public switchMode(newMode: FinancialMode, reason: string): void {
    if (newMode === this.currentMode) return;

    const transition: ModeTransition = {
      from: this.currentMode,
      to: newMode,
      timestamp: new Date(),
      reason,
    };

    this.modeHistory.push(transition);
    this.currentMode = newMode;
  }

  /**
   * Hämta konfiguration för nuvarande läge
   */
  public getCurrentModeConfig(): ModeConfig | undefined {
    return FinancialModesSystem.MODE_CONFIGS.find(c => c.mode === this.currentMode);
  }

  /**
   * Hämta rekommenderade åtgärder för nuvarande läge
   */
  public getRecommendedActions(): string[] {
    const config = this.getCurrentModeConfig();
    return config?.actions || [];
  }

  /**
   * Aktivera familjeläge manuellt
   */
  public enableFamilyMode(): void {
    this.switchMode('Familj', 'Manuellt aktiverat av användare');
  }

  /**
   * Avaktivera familjeläge
   */
  public disableFamilyMode(stressScore: number): void {
    const balanceRatio = this.calculateBalanceRatio();
    const suggestedMode = this.determineBestMode(stressScore, balanceRatio);
    this.switchMode(suggestedMode, 'Familjeläge avaktiverat');
  }

  /**
   * Aktivera/avaktivera auto-växling
   */
  public setAutoSwitch(enabled: boolean): void {
    this.autoSwitchEnabled = enabled;
  }

  /**
   * Få användarvenlig beskrivning av nuvarande läge
   */
  public getModeDescription(): string {
    const config = this.getCurrentModeConfig();
    return config?.description || 'Ekonomiskt läge aktivt.';
  }

  /**
   * Få historik över lägesväxlingar
   */
  public getTransitionHistory(): ModeTransition[] {
    return [...this.modeHistory];
  }

  /**
   * Få statistik om lägesanvändning
   */
  public getModeStatistics(): Record<FinancialMode, number> {
    const stats: Record<FinancialMode, number> = {
      'Stabilitet': 0,
      'Optimering': 0,
      'Återhämtning': 0,
      'Övergång': 0,
      'Familj': 0,
    };

    this.modeHistory.forEach(transition => {
      stats[transition.from]++;
    });
    stats[this.currentMode]++;

    return stats;
  }
}
