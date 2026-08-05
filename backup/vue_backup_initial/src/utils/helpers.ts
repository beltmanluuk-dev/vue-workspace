export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
