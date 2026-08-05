import { create } from 'zustand';
import { 
  Bill, 
  User, 
  UserRole, 
  Subscription, 
  PaymentMethod, 
  Transaction, 
  Budget, 
  Notification, 
  Insight, 
  Achievement, 
  Family,
  FamilyMember,
} from '../types';
import { ClarityEngine, DeviationResult } from '../services/ClarityEngine';
import { 
  isUrgentBill, 
  isOverdueBill, 
  calculateSavingsGoal, 
  calculateBudgetUsage,
  generateId,
} from '../utils/helpers';
import loadAllMockData from '../data/mockDataLoader';
import {
  AutopilotLevel,
  FinancialMode,
  FinancialWeather,
  MoneyMomentum,
  RiskLevel,
  PredictiveWarning,
  ClarityEngineState,
  PriceIncreaseAlert,
  PriceAlertAction,
} from '../engine/types';

const mockData = loadAllMockData();

export interface AppState {
  user: User;
  bills: Bill[];
  subscriptions: Subscription[];
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  budgets: Budget[];
  notifications: Notification[];
  insights: Insight[];
  achievements: Achievement[];
  family: Family | null;
  isAutoPilotEnabled: boolean;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasBankConnected: boolean;
  isEmergencyPaused: boolean;
  connectedBank: string | null;
  pendingApprovalBill: Bill | null;
  showDeviationAlert: boolean;
  lastError: string | null;
  isLoading: boolean;
  selectedBillId: string | null;
  // Intelligence Engine State
  financialStressScore: number;
  stressRiskLevel: RiskLevel;
  moneyMomentum: MoneyMomentum;
  financialWeather: FinancialWeather;
  financialMode: FinancialMode;
  autopilotLevel: AutopilotLevel;
  confidenceLevel: number;
  predictedBalance: number;
  riskWarnings: PredictiveWarning[];
  optimizationSuggestions: string[];
  potentialSavings: number;
  engineLastUpdated: Date | null;
  // Price Increase Detection State
  priceAlerts: PriceIncreaseAlert[];
  activePriceAlert: PriceIncreaseAlert | null;
  priceAlertHistory: PriceIncreaseAlert[];
  totalAnnualPriceImpact: number;
  // Actions
  toggleAutoPilot: () => void;
  markBillAsPaid: (billId: string, paymentMethod?: string) => void;
  scheduleBill: (billId: string, date?: Date) => void;
  setAuthenticated: (value: boolean) => void;
  setLoggedIn: (value: boolean) => void;
  setOnboardingComplete: () => void;
  setBankConnected: (bankName: string) => void;
  toggleEmergencyPause: () => void;
  pauseAllBills: () => void;
  resumeAllBills: () => void;
  approveBill: (billId: string) => void;
  checkDeviationAlert: (billId: string) => boolean;
  getDeviationResult: (billId: string) => DeviationResult | null;
  runClarityEngine: () => void;
  setPendingApprovalBill: (bill: Bill | null) => void;
  setShowDeviationAlert: (show: boolean) => void;
  approvePendingBill: (billId: string) => void;
  getBillsRequiringApproval: () => Bill[];
  updateBillUrgencyStatus: () => void;
  getSavingsGoal: () => { amount: number; isValid: boolean };
  getTotalBillsAmount: () => number;
  getUrgentBills: () => Bill[];
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateUserIncome: (income: number) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  setFamilyConnection: (familyId: string, role: UserRole) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'joinedAt'>) => void;
  removeFamilyMember: (memberId: string) => void;
  // Intelligence Engine Actions
  updateEngineState: (state: Partial<ClarityEngineState>) => void;
  setFinancialStress: (score: number, level: RiskLevel) => void;
  setMoneyMomentum: (momentum: MoneyMomentum) => void;
  setFinancialWeather: (weather: FinancialWeather) => void;
  setFinancialMode: (mode: FinancialMode) => void;
  setAutopilotLevel: (level: AutopilotLevel) => void;
  addRiskWarning: (warning: PredictiveWarning) => void;
  clearRiskWarnings: () => void;
  addOptimizationSuggestion: (suggestion: string) => void;
  clearOptimizationSuggestions: () => void;
  setPotentialSavings: (amount: number) => void;
  getFinancialSummary: () => {
    stressLevel: string;
    weather: string;
    momentum: string;
    urgentActions: number;
    savings: number;
  };
  // Price Increase Detection Actions
  setPriceAlerts: (alerts: PriceIncreaseAlert[]) => void;
  setActivePriceAlert: (alert: PriceIncreaseAlert | null) => void;
  handlePriceAlertAction: (alertId: string, action: PriceAlertAction) => void;
  dismissPriceAlert: (alertId: string) => void;
  getPendingPriceAlerts: () => PriceIncreaseAlert[];
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'isDismissed'>) => void;
  markNotificationRead: (notificationId: string) => void;
  dismissNotification: (notificationId: string) => void;
  getUnreadNotifications: () => Notification[];
  // Insights
  addInsight: (insight: Omit<Insight, 'id' | 'createdAt'>) => void;
  dismissInsight: (insightId: string) => void;
  getActiveInsights: () => Insight[];
  // Budgets
  updateBudgetSpent: (category: Budget['category'], amount: number) => void;
  setBudgetLimit: (budgetId: string, limit: number) => void;
  getBudgetAlerts: () => Budget[];
  // Payment methods
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  removePaymentMethod: (methodId: string) => void;
  verifyPaymentMethod: (methodId: string) => void;
  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  // Subscriptions
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  // Bills
  addBill: (bill: Omit<Bill, 'id'>) => string;
  updateBill: (billId: string, updates: Partial<Bill>) => void;
  removeBill: (billId: string) => void;
  selectBill: (billId: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: mockData.user,
  bills: mockData.bills,
  subscriptions: mockData.subscriptions,
  paymentMethods: mockData.paymentMethods,
  transactions: mockData.transactions,
  budgets: mockData.budgets,
  notifications: mockData.notifications,
  insights: mockData.insights,
  achievements: mockData.achievements,
  family: mockData.family,
  isAutoPilotEnabled: mockData.user.isAutoPilotEnabled,
  isLoggedIn: false,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  hasBankConnected: false,
  isEmergencyPaused: false,
  connectedBank: null,
  pendingApprovalBill: null,
  showDeviationAlert: false,
  lastError: null,
  isLoading: false,
  selectedBillId: null,
  // Intelligence Engine State
  financialStressScore: 25,
  stressRiskLevel: 'Låg' as RiskLevel,
  moneyMomentum: 'Stabiliseras' as MoneyMomentum,
  financialWeather: 'sunny' as FinancialWeather,
  financialMode: 'Stabilitet' as FinancialMode,
  autopilotLevel: 'Observera' as AutopilotLevel,
  confidenceLevel: 75,
  predictedBalance: mockData.user.currentBalance || 38750,
  riskWarnings: [] as PredictiveWarning[],
  optimizationSuggestions: [] as string[],
  potentialSavings: mockData.metadata.potentialAnnualSavings || 0,
  engineLastUpdated: null as Date | null,
  // Price Increase Detection State
  priceAlerts: [] as PriceIncreaseAlert[],
  activePriceAlert: null as PriceIncreaseAlert | null,
  priceAlertHistory: [] as PriceIncreaseAlert[],
  totalAnnualPriceImpact: 0,

  toggleAutoPilot: () => {
    const newValue = !get().isAutoPilotEnabled;
    set({ 
      isAutoPilotEnabled: newValue,
      user: { ...get().user, isAutoPilotEnabled: newValue },
    });
  },

  markBillAsPaid: (billId: string, paymentMethod?: string) =>
    set((state) => {
      const bill = state.bills.find((b) => b.id === billId);
      if (!bill) return state;
      
      const updatedBills = state.bills.map((b) =>
        b.id === billId 
          ? { ...b, status: 'paid' as const, paidAt: new Date(), paymentMethod: paymentMethod || b.paymentMethod || 'Autogiro' } 
          : b
      );

      const newTransaction: Transaction = {
        id: generateId('tx'),
        billId,
        vendor: bill.vendor,
        amount: bill.amount,
        date: new Date(),
        status: 'completed',
        method: paymentMethod || 'Autogiro',
        type: 'payment',
        description: bill.description,
      };

      return {
        bills: updatedBills,
        transactions: [newTransaction, ...state.transactions],
      };
    }),

  scheduleBill: (billId: string, date?: Date) =>
    set((state) => ({
      bills: state.bills.map((b) =>
        b.id === billId 
          ? { ...b, status: 'scheduled' as const, scheduledAt: date || new Date() } 
          : b
      ),
    })),

  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

  setLoggedIn: (value: boolean) => set({ isLoggedIn: value, isAuthenticated: value }),

  setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),

  setBankConnected: (bankName: string) => set({ 
    hasBankConnected: true, 
    connectedBank: bankName, 
    isLoggedIn: true,
    user: { ...get().user, currentBalance: get().user.currentBalance || 45000 },
  }),

  toggleEmergencyPause: () => {
    const { isEmergencyPaused } = get();
    if (!isEmergencyPaused) {
      get().pauseAllBills();
    } else {
      get().resumeAllBills();
    }
    set({ isEmergencyPaused: !isEmergencyPaused });
  },

  pauseAllBills: () =>
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.status === 'pending' || bill.status === 'scheduled'
          ? { ...bill, status: 'paused' as const }
          : bill
      ),
    })),

  resumeAllBills: () =>
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.status === 'paused' ? { ...bill, status: 'pending' as const } : bill
      ),
    })),

  approveBill: (billId: string) =>
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.id === billId ? { ...bill, status: 'pending' as const } : bill
      ),
    })),

  checkDeviationAlert: (billId: string) => {
    const bill = get().bills.find((b) => b.id === billId);
    if (!bill || !bill.averageAmount) return false;
    const deviation = (bill.amount - bill.averageAmount) / bill.averageAmount;
    return deviation >= 0.2;
  },

  getDeviationResult: (billId: string) => {
    const bill = get().bills.find((b) => b.id === billId);
    if (!bill) return null;
    const engine = new ClarityEngine(get().bills);
    return engine.checkDeviation(bill);
  },

  runClarityEngine: () => {
    const engine = new ClarityEngine(get().bills);
    const processedBills = engine.processBills(get().bills);
    const billsRequiringApproval = processedBills.filter(b => b.status === 'pending_approval');

    set({ bills: processedBills });

    if (billsRequiringApproval.length > 0 && !get().showDeviationAlert) {
      set({ 
        pendingApprovalBill: billsRequiringApproval[0],
        showDeviationAlert: true 
      });
    }
  },

  setPendingApprovalBill: (bill: Bill | null) => set({ pendingApprovalBill: bill }),

  setShowDeviationAlert: (show: boolean) => set({ showDeviationAlert: show }),

  approvePendingBill: (billId: string) =>
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.id === billId ? { ...bill, status: 'scheduled' as const } : bill
      ),
      showDeviationAlert: false,
      pendingApprovalBill: null,
    })),

  getBillsRequiringApproval: () => {
    const engine = new ClarityEngine(get().bills);
    return engine.getBillsRequiringApproval(get().bills);
  },

  updateBillUrgencyStatus: () => {
    set((state) => ({
      bills: state.bills.map((bill) => {
        const urgent = isUrgentBill(bill.dueDate);
        const overdue = isOverdueBill(bill.dueDate);
        
        if (overdue && bill.status !== 'paid') {
          return { ...bill, status: 'overdue' as const, isUrgent: true };
        }
        
        return { ...bill, isUrgent: urgent };
      }),
    }));
  },

  getSavingsGoal: () => {
    const { user } = get();
    return calculateSavingsGoal(user.monthlyIncome, user.savingsGoalPercent || 20);
  },

  getTotalBillsAmount: () => {
    const { bills } = get();
    const total = bills
      .filter((b) => b.status !== 'paid')
      .reduce((sum, bill) => sum + (bill.amount || 0), 0);
    return isNaN(total) ? 0 : total;
  },

  getUrgentBills: () => {
    return get().bills.filter((bill) => 
      bill.isUrgent && bill.status !== 'paid'
    );
  },

  setError: (error: string | null) => set({ lastError: error }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  updateUserIncome: (income: number) => {
    if (income < 0 || isNaN(income)) return;
    set((state) => ({
      user: { ...state.user, monthlyIncome: income },
    }));
  },

  updateUserProfile: (updates: Partial<User>) => {
    set((state) => ({
      user: { ...state.user, ...updates },
    }));
  },

  setFamilyConnection: (familyId: string, role: UserRole) => {
    set((state) => ({
      user: { ...state.user, familyId, userRole: role },
    }));
  },

  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'joinedAt'>) => {
    set((state) => {
      if (!state.family) return state;
      const newMember: FamilyMember = {
        ...member,
        id: generateId('member'),
        joinedAt: new Date(),
      };
      return {
        family: {
          ...state.family,
          members: [...state.family.members, newMember],
        },
      };
    });
  },

  removeFamilyMember: (memberId: string) => {
    set((state) => {
      if (!state.family) return state;
      return {
        family: {
          ...state.family,
          members: state.family.members.filter((m) => m.id !== memberId),
        },
      };
    });
  },

  // Intelligence Engine Actions
  updateEngineState: (engineState: Partial<ClarityEngineState>) => {
    set((state) => {
      const updates: Partial<AppState> = { engineLastUpdated: new Date() };
      
      if (engineState.stressAnalysis) {
        updates.financialStressScore = engineState.stressAnalysis.stressScore;
        updates.stressRiskLevel = engineState.stressAnalysis.riskLevel;
      }
      if (engineState.momentumAnalysis) {
        updates.moneyMomentum = engineState.momentumAnalysis.momentum;
      }
      if (engineState.weatherForecast) {
        updates.financialWeather = engineState.weatherForecast.current;
      }
      if (engineState.financialMode) {
        updates.financialMode = engineState.financialMode.currentMode;
      }
      if (engineState.autopilotLevel) {
        updates.autopilotLevel = engineState.autopilotLevel;
      }
      if (engineState.predictiveWarnings) {
        updates.riskWarnings = engineState.predictiveWarnings;
      }
      
      return updates;
    });
  },

  setFinancialStress: (score: number, level: RiskLevel) => {
    set({ financialStressScore: score, stressRiskLevel: level });
  },

  setMoneyMomentum: (momentum: MoneyMomentum) => {
    set({ moneyMomentum: momentum });
  },

  setFinancialWeather: (weather: FinancialWeather) => {
    set({ financialWeather: weather });
  },

  setFinancialMode: (mode: FinancialMode) => {
    set({ financialMode: mode });
  },

  setAutopilotLevel: (level: AutopilotLevel) => {
    set({ autopilotLevel: level });
  },

  addRiskWarning: (warning: PredictiveWarning) => {
    set((state) => ({
      riskWarnings: [...state.riskWarnings, warning],
    }));
  },

  clearRiskWarnings: () => {
    set({ riskWarnings: [] });
  },

  addOptimizationSuggestion: (suggestion: string) => {
    set((state) => ({
      optimizationSuggestions: [...state.optimizationSuggestions, suggestion],
    }));
  },

  clearOptimizationSuggestions: () => {
    set({ optimizationSuggestions: [] });
  },

  setPotentialSavings: (amount: number) => {
    set({ potentialSavings: amount });
  },

  getFinancialSummary: () => {
    const state = get();
    const weatherIcons: Record<FinancialWeather, string> = {
      sunny: '☀️',
      partly_cloudy: '🌤️',
      cloudy: '☁️',
      stormy: '⛈️',
    };
    
    return {
      stressLevel: state.stressRiskLevel,
      weather: weatherIcons[state.financialWeather] || '☀️',
      momentum: state.moneyMomentum,
      urgentActions: state.riskWarnings.filter(w => w.severity === 'Kritisk' || w.severity === 'Hög').length,
      savings: state.potentialSavings,
    };
  },

  // Price Increase Detection Actions
  setPriceAlerts: (alerts: PriceIncreaseAlert[]) => {
    const totalImpact = alerts.reduce((sum, alert) => sum + alert.annualImpact, 0);
    set({ 
      priceAlerts: alerts,
      totalAnnualPriceImpact: totalImpact,
    });
    const pending = alerts.find(a => a.status === 'pending');
    if (pending) {
      set({ activePriceAlert: pending });
    }
  },

  setActivePriceAlert: (alert: PriceIncreaseAlert | null) => {
    set({ activePriceAlert: alert });
  },

  handlePriceAlertAction: (alertId: string, action: PriceAlertAction) => {
    const state = get();
    const alert = state.priceAlerts.find(a => a.id === alertId);
    
    if (!alert) return;

    let newStatus: PriceIncreaseAlert['status'] = 'pending';
    
    switch (action) {
      case 'approve':
        newStatus = 'approved';
        break;
      case 'dismiss':
        newStatus = 'dismissed';
        break;
      case 'cancel':
        newStatus = 'cancelled';
        break;
      case 'find_alternative':
        newStatus = 'pending';
        break;
    }

    const updatedAlerts = state.priceAlerts.map(a => 
      a.id === alertId ? { ...a, status: newStatus } : a
    );

    const updatedHistory = [...state.priceAlertHistory, { ...alert, status: newStatus }];

    set({
      priceAlerts: updatedAlerts,
      priceAlertHistory: updatedHistory,
      activePriceAlert: null,
    });

    const nextPending = updatedAlerts.find(a => a.status === 'pending');
    if (nextPending) {
      set({ activePriceAlert: nextPending });
    }
  },

  dismissPriceAlert: (alertId: string) => {
    const state = get();
    const updatedAlerts = state.priceAlerts.map(a => 
      a.id === alertId ? { ...a, status: 'dismissed' as const } : a
    );
    
    set({
      priceAlerts: updatedAlerts,
      activePriceAlert: state.activePriceAlert?.id === alertId ? null : state.activePriceAlert,
    });
  },

  getPendingPriceAlerts: () => {
    return get().priceAlerts.filter(a => a.status === 'pending');
  },

  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'isDismissed'>) => {
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: generateId('notif'),
          createdAt: new Date(),
          isRead: false,
          isDismissed: false,
        },
        ...state.notifications,
      ],
    }));
  },

  markNotificationRead: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
    }));
  },

  dismissNotification: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isDismissed: true } : n
      ),
    }));
  },

  getUnreadNotifications: () => {
    return get().notifications.filter((n) => !n.isRead && !n.isDismissed);
  },

  // Insights
  addInsight: (insight: Omit<Insight, 'id' | 'createdAt'>) => {
    set((state) => ({
      insights: [
        {
          ...insight,
          id: generateId('insight'),
          createdAt: new Date(),
        },
        ...state.insights,
      ],
    }));
  },

  dismissInsight: (insightId: string) => {
    set((state) => ({
      insights: state.insights.map((i) =>
        i.id === insightId ? { ...i, isDismissed: true } : i
      ),
    }));
  },

  getActiveInsights: () => {
    return get().insights.filter((i) => !i.isDismissed);
  },

  // Budgets
  updateBudgetSpent: (category: Budget['category'], amount: number) => {
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.category === category ? { ...b, spent: Math.max(0, (b.spent || 0) + amount) } : b
      ),
    }));
  },

  setBudgetLimit: (budgetId: string, limit: number) => {
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.id === budgetId ? { ...b, limit: Math.max(0, limit) } : b
      ),
    }));
  },

  getBudgetAlerts: () => {
    return get().budgets.filter((b) => {
      const usage = calculateBudgetUsage(b.spent || 0, b.limit);
      return usage >= (b.alertThreshold || 0.8) * 100;
    });
  },

  // Payment methods
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => {
    set((state) => ({
      paymentMethods: [
        ...state.paymentMethods,
        { ...method, id: generateId('pm') },
      ],
    }));
  },

  setDefaultPaymentMethod: (methodId: string) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.map((m) =>
        m.id === methodId ? { ...m, isDefault: true } : { ...m, isDefault: false }
      ),
    }));
  },

  removePaymentMethod: (methodId: string) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.filter((m) => m.id !== methodId),
    }));
  },

  verifyPaymentMethod: (methodId: string) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.map((m) =>
        m.id === methodId ? { ...m, isVerified: true } : m
      ),
    }));
  },

  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => {
    set((state) => ({
      transactions: [
        { ...transaction, id: generateId('tx') },
        ...state.transactions,
      ],
    }));
  },

  // Subscriptions
  updateSubscription: (id: string, updates: Partial<Subscription>) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },

  // Bills
  addBill: (bill: Omit<Bill, 'id'>) => {
    const id = generateId('bill');
    set((state) => ({
      bills: [...state.bills, { ...bill, id }],
    }));
    return id;
  },

  updateBill: (billId: string, updates: Partial<Bill>) => {
    set((state) => ({
      bills: state.bills.map((b) =>
        b.id === billId ? { ...b, ...updates } : b
      ),
    }));
  },

  removeBill: (billId: string) => {
    set((state) => ({
      bills: state.bills.filter((b) => b.id !== billId),
    }));
  },

  selectBill: (billId: string | null) => {
    set({ selectedBillId: billId });
  },
}));

export default useStore;
