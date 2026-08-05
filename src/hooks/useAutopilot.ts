/**
 * useAutopilot Hook
 * Hanterar autopilot-logik med 4 nivåer
 */

import { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import { AutopilotLevel } from '../engine/types';

interface AutopilotAction {
  type: 'schedule' | 'optimize' | 'warn' | 'execute';
  description: string;
  autoExecute: boolean;
  execute?: () => void;
}

interface UseAutopilotReturn {
  level: AutopilotLevel;
  isEnabled: boolean;
  canAutoExecute: boolean;
  description: string;
  suggestedActions: AutopilotAction[];
  setLevel: (level: AutopilotLevel) => void;
  toggleAutopilot: () => void;
  executeAction: (action: AutopilotAction) => void;
}

const LEVEL_DESCRIPTIONS: Record<AutopilotLevel, string> = {
  'Observera': 'VUE observerar din ekonomi och samlar data.',
  'Assistera': 'VUE assisterar med beslut och ger rekommendationer.',
  'Optimera': 'VUE optimerar betalningsdatum och föreslår besparingar.',
  'Full Autopilot': 'VUE hanterar betalningar och optimeringar automatiskt.',
};

const LEVEL_AUTO_EXECUTE: Record<AutopilotLevel, boolean> = {
  'Observera': false,
  'Assistera': false,
  'Optimera': false,
  'Full Autopilot': true,
};

export function useAutopilot(): UseAutopilotReturn {
  const {
    autopilotLevel,
    isAutoPilotEnabled,
    setAutopilotLevel,
    toggleAutoPilot,
    optimizationSuggestions,
    riskWarnings,
    bills,
    markBillAsPaid,
  } = useStore();

  const canAutoExecute = useMemo(() => {
    return isAutoPilotEnabled && LEVEL_AUTO_EXECUTE[autopilotLevel];
  }, [isAutoPilotEnabled, autopilotLevel]);

  const description = useMemo(() => {
    if (!isAutoPilotEnabled) {
      return 'Autopilot är avaktiverad.';
    }
    return LEVEL_DESCRIPTIONS[autopilotLevel];
  }, [isAutoPilotEnabled, autopilotLevel]);

  // Generera föreslagna åtgärder baserat på aktuell data
  const suggestedActions = useMemo<AutopilotAction[]>(() => {
    const actions: AutopilotAction[] = [];

    // Lägg till varningar som åtgärder
    riskWarnings
      .filter(w => w.severity === 'Kritisk' || w.severity === 'Hög')
      .slice(0, 2)
      .forEach(warning => {
        actions.push({
          type: 'warn',
          description: warning.warningMessage,
          autoExecute: false,
        });
      });

    // Lägg till optimeringsförslag
    optimizationSuggestions.slice(0, 2).forEach(suggestion => {
      actions.push({
        type: 'optimize',
        description: suggestion,
        autoExecute: canAutoExecute,
      });
    });

    // Lägg till schemaläggningsåtgärder för kommande fakturor
    const upcomingBills = bills
      .filter(b => b.status === 'pending' && b.isAutoPay)
      .slice(0, 2);

    upcomingBills.forEach(bill => {
      actions.push({
        type: 'schedule',
        description: `Schemalägg ${bill.vendor} (${bill.amount} kr)`,
        autoExecute: canAutoExecute,
        execute: () => markBillAsPaid(bill.id),
      });
    });

    return actions;
  }, [riskWarnings, optimizationSuggestions, bills, canAutoExecute, markBillAsPaid]);

  const setLevel = useCallback((level: AutopilotLevel) => {
    setAutopilotLevel(level);
  }, [setAutopilotLevel]);

  const executeAction = useCallback((action: AutopilotAction) => {
    if (action.execute) {
      action.execute();
    }
    console.log('Executing autopilot action:', action.description);
  }, []);

  return {
    level: autopilotLevel,
    isEnabled: isAutoPilotEnabled,
    canAutoExecute,
    description,
    suggestedActions,
    setLevel,
    toggleAutopilot: toggleAutoPilot,
    executeAction,
  };
}

/**
 * Automatiskt bestämma autopilot-nivå baserat på data och förtroende
 */
export function determineAutopilotLevel(
  confidenceScore: number,
  stressScore: number,
  dataQuality: 'Låg' | 'Medel' | 'Hög'
): AutopilotLevel {
  // Kräv hög datakvalitet för full autopilot
  if (dataQuality === 'Hög' && confidenceScore >= 85 && stressScore < 30) {
    return 'Full Autopilot';
  }

  // Optimera vid god datakvalitet och låg stress
  if (confidenceScore >= 70 && stressScore < 50) {
    return 'Optimera';
  }

  // Assistera vid medel datakvalitet
  if (confidenceScore >= 50) {
    return 'Assistera';
  }

  // Observera som default
  return 'Observera';
}

export default useAutopilot;
