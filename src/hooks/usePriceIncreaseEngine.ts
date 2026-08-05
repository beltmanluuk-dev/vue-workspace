/**
 * usePriceIncreaseEngine Hook
 * React hook för att integrera PriceIncreaseEngine med Zustand store
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { PriceIncreaseEngine } from '../engine/modules/PriceIncreaseEngine';
import { PriceAlertAction, UserFinancialProfile } from '../engine/types';

export function usePriceIncreaseEngine() {
  const {
    bills,
    priceAlerts,
    activePriceAlert,
    priceAlertHistory,
    totalAnnualPriceImpact,
    setPriceAlerts,
    setActivePriceAlert,
    handlePriceAlertAction,
    dismissPriceAlert,
    getPendingPriceAlerts,
  } = useStore();

  // Mock payment history - i produktion skulle detta komma från bankdata
  const mockPaymentHistory: UserFinancialProfile['paymentHistory'] = useMemo(() => {
    const history: UserFinancialProfile['paymentHistory'] = [];
    
    // Generera historik för varje faktura baserat på averageAmount
    bills.forEach(bill => {
      // Skapa 6 månaders historik
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        // Använd averageAmount för historiska betalningar, aktuellt amount för senaste
        const amount = i === 0 ? bill.amount : (bill.averageAmount || bill.amount);
        
        history.push({
          billId: bill.id,
          vendor: bill.vendor,
          amount,
          date,
          wasOnTime: true,
        });
      }
    });

    return history;
  }, [bills]);

  // Skapa engine instance
  const engine = useMemo(() => {
    return new PriceIncreaseEngine(bills, mockPaymentHistory);
  }, [bills, mockPaymentHistory]);

  // Kör analys och uppdatera store
  const runAnalysis = useCallback(() => {
    const result = engine.analyze();
    setPriceAlerts(result.alerts);
  }, [engine, setPriceAlerts]);

  // Kör analys vid mount och när bills ändras
  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  // Hantera användarens action på en varning
  const handleAction = useCallback((action: PriceAlertAction) => {
    if (activePriceAlert) {
      handlePriceAlertAction(activePriceAlert.id, action);
    }
  }, [activePriceAlert, handlePriceAlertAction]);

  // Visa nästa pending alert
  const showNextAlert = useCallback(() => {
    const pending = getPendingPriceAlerts();
    if (pending.length > 0) {
      setActivePriceAlert(pending[0]);
    }
  }, [getPendingPriceAlerts, setActivePriceAlert]);

  // Stäng aktiv alert
  const closeAlert = useCallback(() => {
    setActivePriceAlert(null);
  }, [setActivePriceAlert]);

  // Få sammanfattning
  const summary = useMemo(() => {
    return engine.getSummary();
  }, [engine]);

  // Statistik
  const stats = useMemo(() => {
    const pending = priceAlerts.filter(a => a.status === 'pending');
    const approved = priceAlertHistory.filter(a => a.status === 'approved');
    const cancelled = priceAlertHistory.filter(a => a.status === 'cancelled');

    return {
      pendingCount: pending.length,
      approvedCount: approved.length,
      cancelledCount: cancelled.length,
      totalAnnualImpact: totalAnnualPriceImpact,
      potentialSavings: Math.round(totalAnnualPriceImpact * 0.7),
    };
  }, [priceAlerts, priceAlertHistory, totalAnnualPriceImpact]);

  return {
    // State
    alerts: priceAlerts,
    activeAlert: activePriceAlert,
    alertHistory: priceAlertHistory,
    
    // Actions
    runAnalysis,
    handleAction,
    showNextAlert,
    closeAlert,
    dismissAlert: dismissPriceAlert,
    
    // Computed
    summary,
    stats,
    hasPendingAlerts: stats.pendingCount > 0,
  };
}
