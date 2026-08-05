export interface Bill {
  id: string;
  vendor: string;
  logo: string;
  amount: number;
  averageAmount?: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'scheduled' | 'paused' | 'pending_approval';
  category: 'utilities' | 'subscription' | 'insurance' | 'rent' | 'other';
  isAutoPay: boolean;
  description?: string;
  isUrgent?: boolean;
}

export type UserRole = 'owner' | 'parent' | 'junior' | 'member';

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  isAutoPilotEnabled: boolean;
  // Financial data
  monthlyIncome?: number;
  savingsGoalPercent?: number; // Default 20%
  // Family Connect fields
  familyId?: string;
  userRole?: UserRole;
  parentUserId?: string; // For junior accounts
  linkedAccounts?: string[]; // For parent accounts
}

export interface PaymentMethod {
  id: string;
  type: 'apple_pay' | 'card' | 'bank';
  last4?: string;
  isDefault: boolean;
}
