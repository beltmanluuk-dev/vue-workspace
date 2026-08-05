import { Notification } from '../types';
import { generateId, getDaysUntilDue, formatCurrency } from '../utils/helpers';
import { Bill } from '../types';

export interface NotificationInput {
  type: Notification['type'];
  title: string;
  message: string;
  priority: Notification['priority'];
  actionRoute?: string;
  actionParams?: Record<string, unknown>;
  amount?: number;
}

/**
 * NotificationService handles generation and scheduling of local app notifications.
 * In a production build this can be extended with expo-notifications push scheduling.
 */
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  createNotification(input: NotificationInput): Notification {
    return {
      id: generateId('notif'),
      type: input.type,
      title: input.title,
      message: input.message,
      createdAt: new Date(),
      isRead: false,
      isDismissed: false,
      priority: input.priority || 'medium',
      actionRoute: input.actionRoute,
      actionParams: input.actionParams,
      amount: input.amount,
    };
  }

  /**
   * Generate notifications for bills that are due soon or overdue.
   */
  checkDueBills(bills: Bill[]): NotificationInput[] {
    const notifications: NotificationInput[] = [];
    const now = new Date();

    bills.forEach((bill) => {
      if (bill.status === 'paid') return;

      const daysUntil = getDaysUntilDue(bill.dueDate);

      if (daysUntil < 0) {
        notifications.push({
          type: 'overdue',
          title: `Förfallen faktura: ${bill.vendor}`,
          message: `Din faktura på ${formatCurrency(bill.amount)} till ${bill.vendor} är förfallen.`,
          priority: 'critical',
          actionRoute: 'BillDetail',
          actionParams: { billId: bill.id },
          amount: bill.amount,
        });
      } else if (daysUntil === 0) {
        notifications.push({
          type: 'due_soon',
          title: `Faktura förfaller idag: ${bill.vendor}`,
          message: `Din faktura på ${formatCurrency(bill.amount)} till ${bill.vendor} ska betalas idag.`,
          priority: 'high',
          actionRoute: 'BillDetail',
          actionParams: { billId: bill.id },
          amount: bill.amount,
        });
      } else if (daysUntil === 2) {
        notifications.push({
          type: 'due_soon',
          title: `Påminnelse: ${bill.vendor}`,
          message: `Din faktura på ${formatCurrency(bill.amount)} till ${bill.vendor} förfaller om 2 dagar.`,
          priority: 'medium',
          actionRoute: 'BillDetail',
          actionParams: { billId: bill.id },
          amount: bill.amount,
        });
      }
    });

    return notifications;
  }

  /**
   * Create a notification for a completed autopilot payment.
   */
  autopilotPayment(bill: Bill): NotificationInput {
    return {
      type: 'autopilot_action',
      title: 'Autopiloten betalade en faktura',
      message: `Autopiloten betalade ${formatCurrency(bill.amount)} till ${bill.vendor}.`,
      priority: 'low',
      actionRoute: 'Bills',
      amount: bill.amount,
    };
  }

  /**
   * Create a budget warning notification.
   */
  budgetWarning(category: string, spent: number, limit: number): NotificationInput {
    return {
      type: 'budget_warning',
      title: `Budgetvarning: ${category}`,
      message: `Du har spenderat ${formatCurrency(spent)} av ${formatCurrency(limit)} i kategorin ${category}.`,
      priority: 'high',
      actionRoute: 'Budgets',
      amount: spent,
    };
  }

  /**
   * Create a price increase alert notification.
   */
  priceIncrease(vendor: string, amount: number, percentage: number): NotificationInput {
    return {
      type: 'price_increase',
      title: `Prisökning: ${vendor}`,
      message: `${vendor} har höjt priset med ${percentage.toFixed(1)}% (${formatCurrency(amount)}).`,
      priority: 'high',
      actionRoute: 'Bills',
      amount: amount,
    };
  }

  /**
   * Create a savings milestone notification.
   */
  savingsMilestone(amount: number, total: number): NotificationInput {
    return {
      type: 'savings_milestone',
      title: 'Sparmål uppnått!',
      message: `Du har sparat ${formatCurrency(amount)}. Totalt sparande: ${formatCurrency(total)}.`,
      priority: 'low',
      actionRoute: 'Analytics',
      amount: total,
    };
  }

  /**
   * Create a family notification.
   */
  family(message: string, actionRoute?: string): NotificationInput {
    return {
      type: 'family',
      title: 'Family Connect',
      message,
      priority: 'medium',
      actionRoute,
    };
  }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;
