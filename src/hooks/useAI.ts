/**
 * useAI hook
 * Ger VUE-appen tillgång till generativ AI (Groq idag, Claude imorgon).
 * Nyckeln skickas in vid initiering – lagras aldrig i källkod.
 */

import { useCallback, useMemo, useState } from 'react';
import { AIProvider, AIProviderType, AICompletionRequest, AIServiceConfig } from '../ai';
import { useStore } from '../store';

export interface UseAIOptions {
  provider?: AIProviderType;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export function useAI(options: UseAIOptions = {}) {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey =
    options.apiKey ||
    (typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY : undefined) ||
    '';

  const serviceConfig = useMemo<AIServiceConfig>(() => {
    const upcomingBillsTotal = store.bills
      .filter((b) => b.status !== 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      financialContext: {
        monthlyIncome: store.user.monthlyIncome,
        currentBalance: store.user.currentBalance,
        upcomingBillsTotal,
        savingsGoal: store.user.savingsBalance,
      },
      userTone: 'friendly',
      language: store.user.preferredLanguage || 'sv',
    };
  }, [store.user, store.bills]);

  const provider = useMemo(() => {
    if (!apiKey) return null;
    return new AIProvider(
      {
        provider: options.provider || 'groq',
        apiKey,
        defaultModel: options.model,
        defaultTemperature: options.temperature,
        defaultMaxTokens: options.maxTokens,
      },
      serviceConfig
    );
  }, [apiKey, options.provider, options.model, options.temperature, options.maxTokens, serviceConfig]);

  const ask = useCallback(
    async (question: string, systemPrompt?: string) => {
      if (!provider) {
        setError('Ingen AI-nyckel konfigurerad.');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = systemPrompt
          ? await provider.chat(systemPrompt, question)
          : await provider.askAboutFinances(question);
        return response.content;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI-begäran misslyckades';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const complete = useCallback(
    async (request: AICompletionRequest) => {
      if (!provider) {
        setError('Ingen AI-nyckel konfigurerad.');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await provider.complete(request);
        return response.content;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI-begäran misslyckades';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  return {
    ask,
    complete,
    isLoading,
    error,
    isConfigured: !!provider,
  };
}
