/**
 * useClarityEngine Hook
 * React hook för att använda ClarityEngine V2 med memoization och async
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { ClarityEngineV2 } from '../engine';
import { 
  ClarityEngineState,
  UserFinancialProfile,
} from '../engine/types';

interface UseClarityEngineOptions {
  autoRun?: boolean;
  runInterval?: number; // milliseconds
}

interface UseClarityEngineReturn {
  state: ClarityEngineState | null;
  isRunning: boolean;
  lastError: string | null;
  runAnalysis: () => Promise<void>;
  getQuickSummary: () => ReturnType<ClarityEngineV2['getQuickSummary']> | null;
  getPrioritizedActions: () => string[];
}

export function useClarityEngine(
  options: UseClarityEngineOptions = {}
): UseClarityEngineReturn {
  const { autoRun = true, runInterval = 60000 } = options;

  const { 
    user, 
    bills,
    updateEngineState,
    setError,
    setLoading,
    setPotentialSavings,
  } = useStore();

  const [state, setState] = useState<ClarityEngineState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const engineRef = useRef<ClarityEngineV2 | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Skapa UserFinancialProfile från store
  const profile = useMemo<UserFinancialProfile>(() => ({
    monthlyIncome: user.monthlyIncome || 0,
    incomeDay: 25, // Default lönedag
    currentBalance: 45000, // Skulle komma från bankdata
    savingsBalance: 10000,
    totalMonthlyBills: bills
      .filter(b => b.status !== 'paid')
      .reduce((sum, b) => sum + b.amount, 0),
    averageMonthlySpending: bills
      .filter(b => b.status !== 'paid')
      .reduce((sum, b) => sum + b.amount, 0) * 1.2,
    paymentHistory: [], // Skulle komma från historisk data
  }), [user.monthlyIncome, bills]);

  // Initiera engine
  useEffect(() => {
    engineRef.current = new ClarityEngineV2(profile, bills);
  }, [profile, bills]);

  // Kör analys
  const runAnalysis = useCallback(async () => {
    if (!engineRef.current || isRunning) return;

    setIsRunning(true);
    setLoading(true);
    setLastError(null);

    try {
      const result = await engineRef.current.runFullAnalysis();
      setState(result);
      
      // Uppdatera global store
      updateEngineState(result);
      
      // Beräkna och sätt potentiella besparingar
      const subscriptionSavings = result.subscriptionAnalysis
        .reduce((sum, s) => sum + s.potentialSavings, 0);
      const leakSavings = result.passiveLeaks
        .reduce((sum, l) => sum + l.totalAnnualLoss, 0);
      setPotentialSavings(subscriptionSavings + leakSavings);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analys misslyckades';
      setLastError(errorMessage);
      setError(errorMessage);
      console.error('ClarityEngine analysis failed:', error);
    } finally {
      setIsRunning(false);
      setLoading(false);
    }
  }, [isRunning, updateEngineState, setError, setLoading, setPotentialSavings]);

  // Auto-kör vid mount och interval
  useEffect(() => {
    if (autoRun) {
      runAnalysis();

      if (runInterval > 0) {
        intervalRef.current = setInterval(runAnalysis, runInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRun, runInterval, runAnalysis]);

  // Memoized getters
  const getQuickSummary = useCallback(() => {
    if (!engineRef.current) return null;
    return engineRef.current.getQuickSummary();
  }, []);

  const getPrioritizedActions = useCallback(() => {
    if (!engineRef.current) return [];
    return engineRef.current.getPrioritizedActions();
  }, []);

  return {
    state,
    isRunning,
    lastError,
    runAnalysis,
    getQuickSummary,
    getPrioritizedActions,
  };
}

export default useClarityEngine;
