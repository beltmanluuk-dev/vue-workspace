export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getDaysUntilDue = (dueDate: Date): number => {
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a bill is urgent (due within 48 hours / 2 days)
 */
export const isUrgentBill = (dueDate: Date): boolean => {
  const daysUntilDue = getDaysUntilDue(dueDate);
  return daysUntilDue <= 2 && daysUntilDue >= 0;
};

/**
 * Check if a bill is overdue
 */
export const isOverdueBill = (dueDate: Date): boolean => {
  return getDaysUntilDue(dueDate) < 0;
};

/**
 * Calculate savings based on income and 20% rule
 * Returns 0 if calculation results in NaN or negative
 */
export const calculateSavingsGoal = (
  monthlyIncome: number | undefined,
  savingsPercent: number = 20
): { amount: number; isValid: boolean } => {
  if (!monthlyIncome || monthlyIncome <= 0 || isNaN(monthlyIncome)) {
    return { amount: 0, isValid: false };
  }
  
  const savingsAmount = (monthlyIncome * savingsPercent) / 100;
  
  if (isNaN(savingsAmount) || savingsAmount < 0) {
    return { amount: 0, isValid: false };
  }
  
  return { amount: Math.round(savingsAmount), isValid: true };
};

/**
 * Calculate remaining budget after bills
 * Returns 0 with warning if negative
 */
export const calculateRemainingBudget = (
  monthlyIncome: number | undefined,
  totalBills: number
): { amount: number; isNegative: boolean; isValid: boolean } => {
  if (!monthlyIncome || monthlyIncome <= 0 || isNaN(monthlyIncome)) {
    return { amount: 0, isNegative: false, isValid: false };
  }
  
  const remaining = monthlyIncome - totalBills;
  
  if (isNaN(remaining)) {
    return { amount: 0, isNegative: false, isValid: false };
  }
  
  return {
    amount: Math.max(0, remaining),
    isNegative: remaining < 0,
    isValid: true,
  };
};

/**
 * Safe number formatter - prevents NaN display
 */
export const safeFormatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 kr';
  }
  return formatCurrency(amount);
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (!previous) return 0;
  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10;
};

/**
 * Format a full date in Swedish style
 */
export const formatFullDate = (date: Date): string => {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format date as ISO YYYY-MM-DD
 */
export const formatISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Parse a date string to Date object
 */
export const parseDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) return dateString;
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

/**
 * Generate a unique ID
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculate what percentage of a budget has been spent
 */
export const calculateBudgetUsage = (spent: number, limit: number): number => {
  if (!limit || limit <= 0) return 0;
  return clamp((spent / limit) * 100, 0, 1000);
};

/**
 * Group bills by category and sum amounts
 */
export const groupBillsByCategory = <T extends { category: string; amount: number }>(
  items: T[]
): Record<string, number> => {
  return items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.amount || 0);
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Sort bills by due date ascending
 */
export const sortByDueDate = <T extends { dueDate: Date }>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

/**
 * Format relative time in Swedish
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'idag';
  if (diffDays === 1) return 'imorgon';
  if (diffDays === -1) return 'igår';
  if (diffDays > 1) return `om ${diffDays} dagar`;
  return `för ${Math.abs(diffDays)} dagar sedan`;
};

/**
 * Get category label in Swedish
 */
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    utilities: 'Abonnemang & El',
    subscription: 'Prenumerationer',
    insurance: 'Försäkringar',
    rent: 'Boende',
    other: 'Övrigt',
    all: 'Alla kategorier',
  };
  return labels[category] || 'Okänd kategori';
};

/**
 * Sleep/pause helper for async flows
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Debounce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
