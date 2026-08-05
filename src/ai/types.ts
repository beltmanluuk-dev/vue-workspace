/**
 * AI Provider Types
 * En gemensam kontrakt för generativa AI-leverantörer (Groq, Claude, m.fl.)
 */

export type AIProviderType = 'groq' | 'claude' | 'mock';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AICompletionResponse {
  id: string;
  content: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AIProviderConfig {
  provider: AIProviderType;
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
}

export interface IAIProvider {
  readonly provider: AIProviderType;
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
  chat(systemPrompt: string, userPrompt: string): Promise<AICompletionResponse>;
}

export interface AIServiceConfig {
  financialContext?: {
    monthlyIncome?: number;
    currentBalance?: number;
    upcomingBillsTotal?: number;
    savingsGoal?: number;
  };
  userTone?: 'professional' | 'friendly' | 'concise';
  language?: 'sv' | 'en';
}
