/**
 * Claude AI Provider (stub/placeholder)
 * När du migrerar till Claude byter du bara ut API-nyckel, bas-URL och modell.
 * Fabriken i AIProvider.ts hanterar valet automatiskt.
 */

import { IAIProvider, AIProviderType, AICompletionRequest, AICompletionResponse, AIProviderConfig } from './types';

const CLAUDE_BASE_URL = 'https://api.anthropic.com/v1';
const DEFAULT_MODEL = 'claude-3-5-sonnet-20240620';

export class ClaudeProvider implements IAIProvider {
  public readonly provider: AIProviderType = 'claude';

  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;
  private defaultTemperature: number;
  private defaultMaxTokens: number;

  constructor(config: AIProviderConfig) {
    if (!config.apiKey) {
      throw new Error('ClaudeProvider kräver en API-nyckel.');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || CLAUDE_BASE_URL;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
    this.defaultTemperature = config.defaultTemperature ?? 0.7;
    this.defaultMaxTokens = config.defaultMaxTokens ?? 1024;
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || this.defaultModel,
        max_tokens: request.maxTokens ?? this.defaultMaxTokens,
        temperature: request.temperature ?? this.defaultTemperature,
        system: request.messages.find((m) => m.role === 'system')?.content,
        messages: request.messages.filter((m) => m.role !== 'system').map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Okänt fel');
      throw new Error(`Claude API-fel (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    return {
      id: data.id || `claude-${Date.now()}`,
      content: data.content?.[0]?.text || '',
      model: data.model || this.defaultModel,
      usage: {
        promptTokens: data.usage?.input_tokens,
        completionTokens: data.usage?.output_tokens,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
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
}
