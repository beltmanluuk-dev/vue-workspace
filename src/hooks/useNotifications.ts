import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store';
import { notificationService } from '../services/NotificationService';
import { Bill } from '../types';

/**
 * Hook that monitors bills and generates local in-app notifications for due/overdue
 * bills, price increases and budget warnings.
 */
export const useNotifications = () => {
  const bills = useStore((state) => state.bills);
  const budgets = useStore((state) => state.budgets);
  const addNotification = useStore((state) => state.addNotification);
  const notifications = useStore((state) => state.notifications);
  const lastCheck = useRef<number>(0);

  const existingNotificationForBill = useCallback((billId: string, type: string) => {
    return notifications.some(
      (n) =>
        n.type === type &&
        !n.isDismissed &&
        n.createdAt.getTime() > lastCheck.current &&
        n.actionParams?.billId === billId
    );
  }, [notifications]);

  useEffect(() => {
    // Avoid duplicate notifications within the same minute
    if (Date.now() - lastCheck.current < 60_000) return;
    lastCheck.current = Date.now();

    // Due/overdue bills
    const dueNotifications = notificationService.checkDueBills(bills);
    dueNotifications.forEach((input) => {
      const billId = input.actionParams?.billId as string | undefined;
      if (billId && existingNotificationForBill(billId, input.type)) return;
      addNotification(input);
    });

    // Budget warnings
    budgets.forEach((budget) => {
      const usage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
      if (usage >= (budget.alertThreshold || 0.8) * 100) {
        const alreadyWarned = notifications.some(
          (n) => n.type === 'budget_warning' && n.message.includes(budget.category)
        );
        if (!alreadyWarned) {
          addNotification(
            notificationService.budgetWarning(budget.category, budget.spent, budget.limit)
          );
        }
      }
    });

    // Price increase notifications
    bills.forEach((bill) => {
      if (bill.priceIncrease && !existingNotificationForBill(bill.id, 'price_increase')) {
        addNotification(
          notificationService.priceIncrease(
            bill.vendor,
            bill.priceIncrease.absoluteChange,
            bill.priceIncrease.percentageChange
          )
        );
      }
    });
  }, [bills, budgets, addNotification, existingNotificationForBill]);
};

export default useNotifications;
