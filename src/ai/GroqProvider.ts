/**
 * Groq AI Provider
 * Använder Groq API (gratis tier för test) med Llama- eller Mixtral-modeller.
 * Byt enkelt till Claude senare via AIProvider-fabriken.
 */

import { IAIProvider, AIProviderType, AICompletionRequest, AICompletionResponse, AIProviderConfig } from './types';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama3-8b-8192';

export class GroqProvider implements IAIProvider {
  public readonly provider: AIProviderType = 'groq';

  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;
  private defaultTemperature: number;
  private defaultMaxTokens: number;

  constructor(config: AIProviderConfig) {
    if (!config.apiKey) {
      throw new Error('GroqProvider kräver en API-nyckel.');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || GROQ_BASE_URL;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
    this.defaultTemperature = config.defaultTemperature ?? 0.7;
    this.defaultMaxTokens = config.defaultMaxTokens ?? 1024;
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || this.defaultModel,
        messages: request.messages,
        temperature: request.temperature ?? this.defaultTemperature,
        max_tokens: request.maxTokens ?? this.defaultMaxTokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Okänt fel');
      throw new Error(`Groq API-fel (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Oväntat svar från Groq API');
    }

    return {
      id: data.id || `groq-${Date.now()}`,
      content: data.choices[0].message.content,
      model: data.model || this.defaultModel,
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }

  public async chat(systemPrompt: string, userPrompt: string): Promise<AICompletionResponse> {
    return this.complete({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
  }

  /**
   * Hämta lista med tillgängliga modeller hos Groq.
   */
  public async listModels(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data?.map((m: { id: string }) => m.id) || [];
  }
}
