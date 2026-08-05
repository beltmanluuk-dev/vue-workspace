import { Bill, Subscription, User, PaymentMethod, Transaction, Budget, Notification, Insight, Achievement, Family, FamilyMember } from '../types';
import mockData from './mockInvoices.json';
import { parseDate } from '../utils/helpers';

// Parse raw JSON invoice into typed Bill
export const loadMockBills = (): Bill[] => {
  const invoices = (mockData as any).invoices || [];
  return invoices.map((inv: any): Bill => ({
    id: inv.id,
    vendor: inv.vendor,
    logo: inv.logo || `https://logo.clearbit.com/${inv.vendor.toLowerCase().replace(/\s+/g, '')}.se`,
    amount: Number(inv.amount) || 0,
    averageAmount: inv.averageAmount !== undefined ? Number(inv.averageAmount) : undefined,
    dueDate: parseDate(inv.dueDate),
    status: inv.status || 'pending',
    category: inv.category || 'other',
    isAutoPay: inv.isAutoPay ?? false,
    description: inv.description,
    isUrgent: false,
    invoiceNumber: inv.invoiceNumber,
    ocr: inv.ocr,
    bankgiro: inv.bankgiro,
    isDuplicate: inv.isDuplicate,
    duplicateOf: inv.duplicateOf,
    priceIncrease: inv.priceIncrease ? {
      percentageChange: Number(inv.priceIncrease.percentageChange),
      absoluteChange: Number(inv.priceIncrease.absoluteChange),
      reason: inv.priceIncrease.reason,
    } : undefined,
  }));
};

// Parse raw JSON subscriptions into typed Subscription
export const loadMockSubscriptions = (): Subscription[] => {
  const subs = (mockData as any).subscriptions || [];
  return subs.map((sub: any): Subscription => ({
    id: sub.id,
    vendor: sub.vendor,
    logo: sub.logo || `https://logo.clearbit.com/${sub.vendor.toLowerCase().replace(/\s+/g, '')}.se`,
    amount: Number(sub.amount) || 0,
    frequency: sub.frequency || 'monthly',
    nextBillingDate: parseDate(sub.nextBillingDate),
    category: sub.category || 'subscription',
    description: sub.description,
    isActive: sub.isActive ?? true,
    startDate: sub.startDate ? parseDate(sub.startDate) : undefined,
    usageScore: Number(sub.usageScore) || 0,
    recommendation: sub.recommendation || 'keep',
    warning: sub.warning,
    isDuplicate: sub.isDuplicate,
    potentialSavings: sub.potentialSavings || 0,
  }));
};

// Load metadata summary
export const loadMockMetadata = () => {
  return (mockData as any).metadata || {};
};

// Default demo user
export const loadMockUser = (): User => ({
  id: 'user-001',
  name: 'Alexander Bergström',
  firstName: 'Alexander',
  email: 'alexander.bergstrom@vue.app',
  isAutoPilotEnabled: true,
  monthlyIncome: 42000,
  savingsGoalPercent: 18,
  incomeDay: 25,
  currentBalance: 38750,
  savingsBalance: 14200,
  userRole: 'owner',
  linkedAccounts: [],
  preferredLanguage: 'sv',
  notificationsEnabled: true,
  biometricEnabled: true,
  darkMode: 'system',
  payday: 25,
});

// Default payment methods
export const loadMockPaymentMethods = (): PaymentMethod[] => [
  {
    id: 'pm-001',
    type: 'apple_pay',
    name: 'Apple Pay',
    isDefault: true,
    isVerified: true,
  },
  {
    id: 'pm-002',
    type: 'bank',
    name: 'Swedbank',
    bankName: 'Swedbank',
    accountNumber: '8312-9,989 123-4',
    last4: '1234',
    isDefault: false,
    isVerified: true,
  },
  {
    id: 'pm-003',
    type: 'autogiro',
    name: 'Autogiro',
    bankName: 'SEB',
    accountNumber: '5534-1001',
    isDefault: false,
    isVerified: true,
  },
];

// Default budgets based on demo data
export const loadMockBudgets = (): Budget[] => [
  { id: 'bdg-001', category: 'utilities', limit: 2500, spent: 0, period: 'monthly', alertThreshold: 0.8 },
  { id: 'bdg-002', category: 'subscription', limit: 1200, spent: 0, period: 'monthly', alertThreshold: 0.85 },
  { id: 'bdg-003', category: 'insurance', limit: 2500, spent: 0, period: 'monthly', alertThreshold: 0.9 },
  { id: 'bdg-004', category: 'all', limit: 35000, spent: 0, period: 'monthly', alertThreshold: 0.75 },
];

// Default notifications for demo
export const loadMockNotifications = (): Notification[] => [
  {
    id: 'notif-001',
    type: 'price_increase',
    title: 'Prisökning upptäckt',
    message: 'Vattenfall har höjt priset med 27,2% (+267 kr). Vill du granska?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    isDismissed: false,
    priority: 'high',
    actionRoute: 'Bills',
    amount: 267,
  },
  {
    id: 'notif-002',
    type: 'due_soon',
    title: 'Faktura snart förfallen',
    message: 'SATS träningskort på 599 kr förfaller imorgon.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    isDismissed: false,
    priority: 'critical',
    actionRoute: 'Bills',
    amount: 599,
  },
  {
    id: 'notif-003',
    type: 'autopilot_action',
    title: 'Autopiloten betalade Spotify',
    message: 'Autopiloten betalade din Spotify-faktura på 129 kr automatiskt.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
    isDismissed: false,
    priority: 'low',
    amount: 129,
  },
];

// Default insights
export const loadMockInsights = (): Insight[] => [
  {
    id: 'insight-001',
    type: 'saving',
    title: 'Spara 8 616 kr/år',
    description: 'Du har 3 prenumerationer med mycket låg användning. Autopiloten kan avsluta dem.',
    amount: 8616,
    impact: 'high',
    actionText: 'Granska prenumerationer',
    actionRoute: 'Analytics',
    isDismissed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'insight-002',
    type: 'warning',
    title: 'Dubbla Netflix-konton',
    description: 'Vi hittade två identiska Netflix-fakturor. En kan tas bort.',
    amount: 179,
    impact: 'medium',
    actionText: 'Visa dubblett',
    actionRoute: 'Bills',
    isDismissed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 'insight-003',
    type: 'opportunity',
    title: 'Säkert att spendera 8 940 kr',
    description: 'Efter kommande fakturor och sparmål har du utrymme för ytterligare inköp.',
    amount: 8940,
    impact: 'medium',
    actionText: 'Se analys',
    actionRoute: 'Analytics',
    isDismissed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
];

// Default achievements
export const loadMockAchievements = (): Achievement[] => [
  {
    id: 'ach-001',
    title: 'Första betalningen',
    description: 'Betala din första faktura med VUE',
    icon: 'Zap',
    progress: 1,
    target: 1,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: 'ach-002',
    title: 'Autopilot-mästare',
    description: 'Låt autopiloten betala 10 fakturor',
    icon: 'Bot',
    progress: 4,
    target: 10,
    isUnlocked: false,
  },
  {
    id: 'ach-003',
    title: 'Sparhaj',
    description: 'Spara totalt 5 000 kr via autopiloten',
    icon: 'PiggyBank',
    progress: 1420,
    target: 5000,
    isUnlocked: false,
  },
];

// Demo family
export const loadMockFamily = (): Family => ({
  id: 'fam-001',
  name: 'Familjen Bergström',
  ownerId: 'user-001',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
  members: [
    {
      id: 'user-001',
      name: 'Alexander Bergström',
      role: 'owner',
      isActive: true,
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
      monthlyIncome: 42000,
    },
    {
      id: 'user-002',
      name: 'Sofia Bergström',
      role: 'parent',
      email: 'sofia@vue.app',
      isActive: true,
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300),
      monthlyIncome: 38000,
    },
    {
      id: 'user-003',
      name: 'Liam Bergström',
      role: 'junior',
      isActive: true,
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100),
      spendingLimit: 500,
    },
  ],
});

// Demo transactions
export const loadMockTransactions = (bills: Bill[]): Transaction[] => {
  const completed: Transaction[] = bills
    .filter((b) => b.status === 'paid')
    .map((b) => ({
      id: `tx-${b.id}`,
      billId: b.id,
      vendor: b.vendor,
      amount: b.amount,
      date: b.paidAt || new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      status: 'completed',
      method: b.paymentMethod || 'Autogiro',
      type: 'payment',
      description: b.description,
    }));

  return [
    ...completed,
    {
      id: 'tx-savings-001',
      vendor: 'Sparkonto',
      amount: 7560,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      status: 'completed',
      method: 'Autogiro',
      type: 'savings',
      description: 'Månatligt sparande',
    },
  ];
};

// Full demo dataset
export const loadAllMockData = () => {
  const bills = loadMockBills();
  const subscriptions = loadMockSubscriptions();
  const budgets = loadMockBudgets().map((b) => {
    if (b.category === 'all') {
      const spent = bills
        .filter((bill) => bill.status !== 'paid')
        .reduce((sum, bill) => sum + bill.amount, 0);
      return { ...b, spent };
    }
    const spent = bills
      .filter((bill) => bill.category === b.category && bill.status !== 'paid')
      .reduce((sum, bill) => sum + bill.amount, 0);
    return { ...b, spent };
  });

  return {
    user: loadMockUser(),
    bills,
    subscriptions,
    paymentMethods: loadMockPaymentMethods(),
    budgets,
    notifications: loadMockNotifications(),
    insights: loadMockInsights(),
    achievements: loadMockAchievements(),
    family: loadMockFamily(),
    transactions: loadMockTransactions(bills),
    metadata: loadMockMetadata(),
  };
};

export default loadAllMockData;
