/**
 * AI Provider Factory
 * Abstraherar val av generativ AI-leverantör. Byt enkelt mellan Groq och Claude
 * utan att ändra konsumentkod. API-nyckeln läses från miljö/config, aldrig hårdkodad.
 */

import { IAIProvider, AIProviderType, AIProviderConfig, AIServiceConfig, AIMessage, AICompletionResponse } from './types';
import { GroqProvider } from './GroqProvider';
import { ClaudeProvider } from './ClaudeProvider';

// Läs aldrig in hemligheter direkt i källkoden. Använd miljövariabler eller säker lagring.
// I Expo: process.env.EXPO_PUBLIC_GROQ_API_KEY (kräver konfig) eller expo-constants.
function getApiKeyFromEnv(provider: AIProviderType): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return provider === 'groq'
      ? process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY
      : process.env.EXPO_PUBLIC_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;
  }
  return undefined;
}

export class AIProvider implements IAIProvider {
  public readonly provider: AIProviderType;
  private delegate: IAIProvider;
  private config: AIServiceConfig;

  constructor(providerConfig: Partial<AIProviderConfig> & { provider: AIProviderType }, serviceConfig: AIServiceConfig = {}) {
    const apiKey = providerConfig.apiKey || getApiKeyFromEnv(providerConfig.provider) || '';

    const fullConfig: AIProviderConfig = {
      ...providerConfig,
      apiKey,
    };

    switch (fullConfig.provider) {
      case 'groq':
        this.delegate = new GroqProvider(fullConfig);
        break;
      case 'claude':
        this.delegate = new ClaudeProvider(fullConfig);
        break;
      default:
        throw new Error(`Okänd AI-leverantör: ${fullConfig.provider}`);
    }

    this.provider = fullConfig.provider;
    this.config = serviceConfig;
  }

  public async complete(request: Parameters<IAIProvider['complete']>[0]): Promise<AICompletionResponse> {
    return this.delegate.complete(request);
  }

  public async chat(systemPrompt: string, userPrompt: string): Promise<AICompletionResponse> {
    const contextualSystem = this.buildSystemPrompt(systemPrompt);
    return this.delegate.chat(contextualSystem, userPrompt);
  }

  public async askAboutFinances(question: string): Promise<AICompletionResponse> {
    const systemPrompt = this.getFinancialSystemPrompt();
    return this.chat(systemPrompt, question);
  }

  private buildSystemPrompt(base: string): string {
    const { language = 'sv', userTone = 'friendly' } = this.config;
    const toneInstruction = {
      professional: 'Var professionell, strukturerad och koncis.',
      friendly: 'Var vänlig, uppmuntrande och lättsmält.',
      concise: 'Var extremt kortfattad och fokuserad.',
    }[userTone];

    const languageInstruction = language === 'sv'
      ? 'Svara alltid på svenska.'
      : 'Svara alltid på engelska.';

    return `${base}\n\n${toneInstruction} ${languageInstruction}`;
  }

  private getFinancialSystemPrompt(): string {
    const ctx = this.config.financialContext;
    const contextLines: string[] = [];

    if (ctx?.monthlyIncome !== undefined) {
      contextLines.push(`Användarens månadsinkomst är ${ctx.monthlyIncome} kr.`);
    }
    if (ctx?.currentBalance !== undefined) {
      contextLines.push(`Nuvarande saldo är ${ctx.currentBalance} kr.`);
    }
    if (ctx?.upcomingBillsTotal !== undefined) {
      contextLines.push(`Kommande fakturor totalt: ${ctx.upcomingBillsTotal} kr.`);
    }
    if (ctx?.savingsGoal !== undefined) {
      contextLines.push(`Spar mål: ${ctx.savingsGoal} kr.`);
    }

    const context = contextLines.length > 0
      ? `Här är användarens ekonomiska kontext:\n${contextLines.join('\n')}\n\n`
      : '';

    return `${context}Du är VUE, en personlig ekonomiassistent. Du hjälper användaren att förstå, förbättra och optimera sin privatekonomi. Ge råd baserat på kontexten, men påminn alltid om att du inte är en finansiell rådgivare.`;
  }
}

export function createAIProvider(
  provider: AIProviderType,
  apiKey: string,
  serviceConfig?: AIServiceConfig
): AIProvider {
  return new AIProvider({ provider, apiKey }, serviceConfig);
}

export * from './types';
