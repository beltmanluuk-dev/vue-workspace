import { create } from 'zustand';
import { Bill, User, UserRole } from '../types';
import { ClarityEngine, DeviationResult } from '../services/ClarityEngine';
import { isUrgentBill, isOverdueBill, calculateSavingsGoal } from '../utils/helpers';

interface AppState {
  user: User;
  bills: Bill[];
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
  // Actions
  toggleAutoPilot: () => void;
  markBillAsPaid: (billId: string) => void;
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
  // New actions
  updateBillUrgencyStatus: () => void;
  getSavingsGoal: () => { amount: number; isValid: boolean };
  getTotalBillsAmount: () => number;
  getUrgentBills: () => Bill[];
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateUserIncome: (income: number) => void;
  setFamilyConnection: (familyId: string, role: UserRole) => void;
}

const mockBills: Bill[] = [
  {
    id: '1',
    vendor: 'Netflix',
    logo: 'https://logo.clearbit.com/netflix.com',
    amount: 149,
    averageAmount: 149,
    dueDate: new Date(2026, 1, 15),
    status: 'pending',
    category: 'subscription',
    isAutoPay: true,
    description: 'Premium Plan',
  },
  {
    id: '2',
    vendor: 'Spotify',
    logo: 'https://logo.clearbit.com/spotify.com',
    amount: 119,
    averageAmount: 119,
    dueDate: new Date(2026, 1, 18),
    status: 'pending',
    category: 'subscription',
    isAutoPay: true,
    description: 'Family Plan',
  },
  {
    id: '3',
    vendor: 'Vattenfall',
    logo: 'https://logo.clearbit.com/vattenfall.com',
    amount: 892,
    averageAmount: 720,
    dueDate: new Date(2026, 1, 22),
    status: 'pending',
    category: 'utilities',
    isAutoPay: false,
    description: 'February Invoice',
  },
  {
    id: '4',
    vendor: 'Telia',
    logo: 'https://logo.clearbit.com/telia.se',
    amount: 449,
    averageAmount: 449,
    dueDate: new Date(2026, 1, 25),
    status: 'scheduled',
    category: 'utilities',
    isAutoPay: true,
    description: 'Mobile + Internet',
  },
  {
    id: '5',
    vendor: 'Folksam',
    logo: 'https://logo.clearbit.com/folksam.se',
    amount: 1250,
    averageAmount: 1250,
    dueDate: new Date(2026, 2, 1),
    status: 'pending',
    category: 'insurance',
    isAutoPay: false,
    description: 'Home Insurance Q1',
  },
];

export const useStore = create<AppState>((set, get) => ({
  user: {
    id: '1',
    name: 'Alexander',
    firstName: 'Alexander',
    email: 'alexander@vue.app',
    isAutoPilotEnabled: true,
    monthlyIncome: 45000,
    savingsGoalPercent: 20,
    familyId: undefined,
    userRole: 'owner' as UserRole,
    linkedAccounts: [],
  },
  bills: mockBills,
  isAutoPilotEnabled: true,
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
  
  toggleAutoPilot: () => set((state) => ({ isAutoPilotEnabled: !state.isAutoPilotEnabled })),
  
  markBillAsPaid: (billId: string) =>
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.id === billId ? { ...bill, status: 'paid' as const } : bill
      ),
    })),
  
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  
  setLoggedIn: (value: boolean) => set({ isLoggedIn: value, isAuthenticated: value }),
  
  setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
  
  setBankConnected: (bankName: string) => set({ hasBankConnected: true, connectedBank: bankName, isLoggedIn: true }),
  
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

  // New actions for production-ready functionality
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

  setFamilyConnection: (familyId: string, role: UserRole) => {
    set((state) => ({
      user: { ...state.user, familyId, userRole: role },
    }));
  },
}));
