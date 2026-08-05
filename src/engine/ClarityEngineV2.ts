/**
 * ClarityEngine V2
 * Central intelligensmotor för VUE
 * Koordinerar alla intelligence-moduler och ger en enhetlig analys
 */

import { Bill } from '../types';
import {
  ClarityEngineState,
  ClarityEngineConfig,
  DEFAULT_ENGINE_CONFIG,
  UserFinancialProfile,
  AutopilotLevel,
  StressAnalysis,
  PredictiveWarning,
  PaymentOptimization,
  SubscriptionAnalysis,
  PassiveLeak,
  MomentumAnalysis,
  WeatherForecast,
  SpendingOpportunity,
  BehavioralPattern,
  InvisibleSavings,
  FinancialModeState,
} from './types';

import {
  FinancialStressEngine,
  PredictiveWarningEngine,
  SmartPaymentTimingEngine,
  SubscriptionDetectionEngine,
  PassiveLeakDetectionEngine,
  MoneyMomentumEngine,
  FinancialWeatherEngine,
  OpportunityEngine,
  ConfidenceEngine,
  BehavioralPatternEngine,
  InvisibleSavingsEngine,
  FinancialModesSystem,
} from './modules';

export class ClarityEngineV2 {
  private profile: UserFinancialProfile;
  private bills: Bill[];
  private config: ClarityEngineConfig;
  private state: ClarityEngineState;

  constructor(
    profile: UserFinancialProfile,
    bills: Bill[],
    config: Partial<ClarityEngineConfig> = {}
  ) {
    this.profile = profile;
    this.bills = bills;
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
    this.state = this.initializeState();
  }

  private initializeState(): ClarityEngineState {
    return {
      isInitialized: false,
      lastAnalysis: null,
      stressAnalysis: null,
      predictiveWarnings: [],
      paymentOptimizations: [],
      subscriptionAnalysis: [],
      passiveLeaks: [],
      momentumAnalysis: null,
      weatherForecast: null,
      spendingOpportunity: null,
      behavioralPatterns: [],
      invisibleSavings: null,
      financialMode: {
        currentMode: 'Stabilitet',
        suggestedMode: 'Stabilitet',
        autoSwitchEnabled: true,
        modeHistory: [],
      },
      autopilotLevel: 'Observera',
    };
  }

  /**
   * Kör fullständig analys av alla moduler
   */
  public async runFullAnalysis(): Promise<ClarityEngineState> {
    try {
      // Kör alla analyser parallellt för bästa prestanda
      const [
        stressAnalysis,
        predictiveWarnings,
        paymentOptimizations,
        subscriptionAnalysis,
        passiveLeaks,
        momentumAnalysis,
        weatherForecast,
        spendingOpportunity,
        behavioralPatterns,
        invisibleSavings,
      ] = await Promise.all([
        this.analyzeStress(),
        this.analyzePredictiveWarnings(),
        this.analyzePaymentOptimizations(),
        this.analyzeSubscriptions(),
        this.analyzePassiveLeaks(),
        this.analyzeMomentum(),
        this.analyzeWeather(),
        this.analyzeOpportunities(),
        this.analyzeBehavior(),
        this.analyzeInvisibleSavings(),
      ]);

      // Uppdatera financial mode baserat på stress
      const financialMode = this.analyzeFinancialMode(stressAnalysis.stressScore);

      // Bestäm autopilot-nivå
      const autopilotLevel = this.determineAutopilotLevel(stressAnalysis, financialMode);

      this.state = {
        isInitialized: true,
        lastAnalysis: new Date(),
        stressAnalysis,
        predictiveWarnings,
        paymentOptimizations,
        subscriptionAnalysis,
        passiveLeaks,
        momentumAnalysis,
        weatherForecast,
        spendingOpportunity,
        behavioralPatterns,
        invisibleSavings,
        financialMode,
        autopilotLevel,
      };

      return this.state;
    } catch (error) {
      console.error('ClarityEngine analysis failed:', error);
      throw error;
    }
  }

  private async analyzeStress(): Promise<StressAnalysis> {
    const engine = new FinancialStressEngine(this.profile, this.bills);
    return engine.analyze();
  }

  private async analyzePredictiveWarnings(): Promise<PredictiveWarning[]> {
    const engine = new PredictiveWarningEngine(
      this.profile,
      this.bills,
      this.config.predictionDays
    );
    return engine.analyze();
  }

  private async analyzePaymentOptimizations(): Promise<PaymentOptimization[]> {
    const engine = new SmartPaymentTimingEngine(this.profile, this.bills);
    return engine.analyze();
  }

  private async analyzeSubscriptions(): Promise<SubscriptionAnalysis[]> {
    const engine = new SubscriptionDetectionEngine(this.bills);
    return engine.analyze();
  }

  private async analyzePassiveLeaks(): Promise<PassiveLeak[]> {
    const engine = new PassiveLeakDetectionEngine(this.bills, this.profile.paymentHistory);
    return engine.analyze();
  }

  private async analyzeMomentum(): Promise<MomentumAnalysis> {
    const engine = new MoneyMomentumEngine(this.profile, this.bills);
    return engine.analyze();
  }

  private async analyzeWeather(): Promise<WeatherForecast> {
    const engine = new FinancialWeatherEngine(this.profile, this.bills);
    return engine.analyze();
  }

  private async analyzeOpportunities(): Promise<SpendingOpportunity> {
    const engine = new OpportunityEngine(this.profile, this.bills);
    return engine.analyze();
  }

  private async analyzeBehavior(): Promise<BehavioralPattern[]> {
    const engine = new BehavioralPatternEngine(this.profile, this.bills);
    return engine.analyze();
  }

  private async analyzeInvisibleSavings(): Promise<InvisibleSavings> {
    const engine = new InvisibleSavingsEngine(this.profile, this.bills);
    return engine.analyze();
  }

  private analyzeFinancialMode(stressScore: number): FinancialModeState {
    const system = new FinancialModesSystem(this.profile, this.bills);
    return system.analyze(stressScore);
  }

  private determineAutopilotLevel(
    stress: StressAnalysis,
    mode: FinancialModeState
  ): AutopilotLevel {
    // Autopilot-nivå baseras på datakvalitet och ekonomisk status
    const confidence = new ConfidenceEngine(this.profile, this.bills);
    const confidenceResult = confidence.calculateConfidence('general');

    if (confidenceResult.confidenceScore < 50) {
      return 'Observera'; // För lite data för automation
    }

    if (stress.stressScore >= 70) {
      return 'Assistera'; // Hög stress = mer manuell kontroll
    }

    if (mode.currentMode === 'Optimering' && confidenceResult.confidenceScore >= 80) {
      return 'Full Autopilot'; // Bra data + stabil ekonomi
    }

    if (confidenceResult.confidenceScore >= 70) {
      return 'Optimera';
    }

    return 'Assistera';
  }

  /**
   * Hämta snabbsammanfattning för dashboard
   */
  public getQuickSummary(): {
    stressLevel: string;
    weather: string;
    momentum: string;
    urgentActions: number;
    potentialSavings: number;
  } {
    return {
      stressLevel: this.state.stressAnalysis?.riskLevel || 'Okänd',
      weather: this.state.weatherForecast?.icon || '☀️',
      momentum: this.state.momentumAnalysis?.momentum || 'Neutral',
      urgentActions: this.state.predictiveWarnings.filter(w => w.severity === 'Kritisk').length,
      potentialSavings: this.calculateTotalPotentialSavings(),
    };
  }

  private calculateTotalPotentialSavings(): number {
    const subscriptionSavings = this.state.subscriptionAnalysis
      .reduce((sum, s) => sum + s.potentialSavings, 0);
    
    const leakSavings = this.state.passiveLeaks
      .reduce((sum, l) => sum + l.totalAnnualLoss, 0);

    return subscriptionSavings + leakSavings;
  }

  /**
   * Hämta prioriterade åtgärder
   */
  public getPrioritizedActions(): string[] {
    const actions: string[] = [];

    // Kritiska varningar först
    this.state.predictiveWarnings
      .filter(w => w.severity === 'Kritisk' || w.severity === 'Hög')
      .forEach(w => actions.push(w.warningMessage));

    // Prenumerationer att granska
    this.state.subscriptionAnalysis
      .filter(s => s.recommendation === 'Avsluta')
      .slice(0, 2)
      .forEach(s => actions.push(`Granska ${s.vendor} - potentiell besparing ${s.potentialSavings} kr/år`));

    // Betalningsoptimeringar
    this.state.paymentOptimizations
      .filter(o => o.priority === 'Hög' || o.priority === 'Kritisk')
      .slice(0, 2)
      .forEach(o => actions.push(o.reason));

    return actions.slice(0, 5); // Max 5 åtgärder
  }

  /**
   * Hämta aktuellt state
   */
  public getState(): ClarityEngineState {
    return this.state;
  }

  /**
   * Uppdatera profil och kör ny analys
   */
  public async updateProfile(profile: Partial<UserFinancialProfile>): Promise<void> {
    this.profile = { ...this.profile, ...profile };
    await this.runFullAnalysis();
  }

  /**
   * Uppdatera fakturor och kör ny analys
   */
  public async updateBills(bills: Bill[]): Promise<void> {
    this.bills = bills;
    await this.runFullAnalysis();
  }
}

export default ClarityEngineV2;
