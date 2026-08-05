/**
 * VUE Intelligence Engine Types
 * Centrala typer för alla intelligence-moduler
 */

// ==================== CORE TYPES ====================

export type RiskLevel = 'Låg' | 'Medel' | 'Hög' | 'Kritisk';
export type FinancialWeather = 'sunny' | 'partly_cloudy' | 'cloudy' | 'stormy';
export type MoneyMomentum = 'Stabiliseras' | 'Neutral' | 'Ökad risk' | 'Förbättras';
export type AutopilotLevel = 'Observera' | 'Assistera' | 'Optimera' | 'Full Autopilot';
export type FinancialMode = 'Stabilitet' | 'Optimering' | 'Återhämtning' | 'Övergång' | 'Familj';

// ==================== ANALYSIS RESULTS ====================

export interface ConfidenceResult {
  confidenceScore: number; // 0-100
  dataQuality: 'Låg' | 'Medel' | 'Hög';
  lastUpdated: Date;
}

export interface StressAnalysis extends ConfidenceResult {
  stressScore: number; // 0-100
  riskLevel: RiskLevel;
  factors: StressFactor[];
  recommendation: string;
}

export interface StressFactor {
  type: 'income' | 'bills' | 'balance' | 'history' | 'timing';
  impact: number; // -100 to +100
  description: string;
}

export interface PredictiveWarning extends ConfidenceResult {
  daysUntilRisk: number;
  predictedBalance: number;
  warningMessage: string;
  severity: RiskLevel;
  suggestedActions: string[];
}

export interface BalanceForecast {
  date: Date;
  predictedBalance: number;
  scheduledOutflows: number;
  expectedInflows: number;
  isNegative: boolean;
}

export interface PaymentOptimization extends ConfidenceResult {
  billId: string;
  currentDate: Date;
  suggestedDate: Date;
  reason: string;
  savings: number;
  priority: 'Låg' | 'Medel' | 'Hög' | 'Kritisk';
}

export interface SubscriptionAnalysis extends ConfidenceResult {
  subscriptionId: string;
  vendor: string;
  monthlyAmount: number;
  usageScore: number; // 0-100
  isDuplicate: boolean;
  duplicateOf?: string;
  recommendation: 'Behåll' | 'Granska' | 'Avsluta';
  annualCost: number;
  potentialSavings: number;
}

export interface PassiveLeak extends ConfidenceResult {
  billId: string;
  vendor: string;
  priceIncreases: PriceIncrease[];
  totalAnnualLoss: number;
  recommendation: string;
}

export interface PriceIncrease {
  date: Date;
  previousAmount: number;
  newAmount: number;
  percentageIncrease: number;
}

export interface ShockAbsorberAction {
  type: 'reschedule' | 'pause' | 'buffer' | 'notify';
  billId?: string;
  description: string;
  priority: number;
  autoExecute: boolean;
}

export interface MomentumAnalysis extends ConfidenceResult {
  momentum: MoneyMomentum;
  trend: number; // -100 to +100
  weekOverWeekChange: number;
  monthOverMonthChange: number;
  insight: string;
}

export interface WeatherForecast extends ConfidenceResult {
  current: FinancialWeather;
  forecast7Days: FinancialWeather;
  forecast30Days: FinancialWeather;
  summary: string;
  icon: string;
}

export interface SpendingOpportunity extends ConfidenceResult {
  availableAmount: number;
  safeToSpend: boolean;
  nextRiskDate: Date;
  recommendation: string;
}

export interface BehavioralPattern extends ConfidenceResult {
  patternType: 'post_salary' | 'weekend' | 'seasonal' | 'impulse' | 'planned';
  frequency: number;
  averageAmount: number;
  description: string;
  suggestion: string;
}

export interface InvisibleSavings extends ConfidenceResult {
  currentBuffer: number;
  monthlyContribution: number;
  projectedAnnualSavings: number;
  lastContribution: Date;
  isActive: boolean;
}

export interface FinancialModeState {
  currentMode: FinancialMode;
  suggestedMode: FinancialMode;
  autoSwitchEnabled: boolean;
  modeHistory: ModeTransition[];
}

export interface ModeTransition {
  from: FinancialMode;
  to: FinancialMode;
  timestamp: Date;
  reason: string;
}

// ==================== ENGINE STATE ====================

export interface ClarityEngineState {
  isInitialized: boolean;
  lastAnalysis: Date | null;
  stressAnalysis: StressAnalysis | null;
  predictiveWarnings: PredictiveWarning[];
  paymentOptimizations: PaymentOptimization[];
  subscriptionAnalysis: SubscriptionAnalysis[];
  passiveLeaks: PassiveLeak[];
  momentumAnalysis: MomentumAnalysis | null;
  weatherForecast: WeatherForecast | null;
  spendingOpportunity: SpendingOpportunity | null;
  behavioralPatterns: BehavioralPattern[];
  invisibleSavings: InvisibleSavings | null;
  financialMode: FinancialModeState;
  autopilotLevel: AutopilotLevel;
}

// ==================== USER FINANCIAL DATA ====================

export interface UserFinancialProfile {
  monthlyIncome: number;
  incomeDay: number; // Day of month salary arrives
  currentBalance: number;
  savingsBalance: number;
  totalMonthlyBills: number;
  averageMonthlySpending: number;
  paymentHistory: PaymentHistoryEntry[];
}

export interface PaymentHistoryEntry {
  billId: string;
  vendor: string;
  amount: number;
  date: Date;
  wasOnTime: boolean;
}

// ==================== ENGINE CONFIG ====================

export interface ClarityEngineConfig {
  stressThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  predictionDays: number;
  autopilotEnabled: boolean;
  invisibleSavingsEnabled: boolean;
  notificationsEnabled: boolean;
}

// ==================== PRICE INCREASE DETECTION ====================

export type PriceAlertSeverity = 'minor' | 'moderate' | 'significant';
export type PriceAlertAction = 'approve' | 'find_alternative' | 'cancel' | 'dismiss';

export interface PriceIncreaseAlert extends ConfidenceResult {
  id: string;
  vendor: string;
  vendorLogo: string;
  category: 'subscription' | 'utilities' | 'insurance' | 'other';
  previousPrice: number;
  newPrice: number;
  priceChange: number;
  percentageChange: number;
  severity: PriceAlertSeverity;
  isRecurring: boolean;
  detectedAt: Date;
  historicalPrices: HistoricalPrice[];
  annualImpact: number;
  recommendation: string;
  status: 'pending' | 'approved' | 'dismissed' | 'cancelled';
}

export interface HistoricalPrice {
  date: Date;
  amount: number;
}

export interface PriceIncreaseEngineState {
  alerts: PriceIncreaseAlert[];
  totalAnnualImpact: number;
  potentialSavings: number;
  lastScan: Date | null;
  alertHistory: PriceIncreaseAlert[];
}

export interface PriceIncreaseConfig {
  percentageThreshold: number; // Default 2%
  absoluteThreshold: number; // Default 10 kr
  monthsToAnalyze: number; // Default 3
  ignoreOneTimePurchases: boolean;
}

export const DEFAULT_PRICE_INCREASE_CONFIG: PriceIncreaseConfig = {
  percentageThreshold: 2,
  absoluteThreshold: 10,
  monthsToAnalyze: 3,
  ignoreOneTimePurchases: true,
};

export const DEFAULT_ENGINE_CONFIG: ClarityEngineConfig = {
  stressThresholds: {
    low: 30,
    medium: 60,
    high: 80,
  },
  predictionDays: 30,
  autopilotEnabled: true,
  invisibleSavingsEnabled: true,
  notificationsEnabled: true,
};
