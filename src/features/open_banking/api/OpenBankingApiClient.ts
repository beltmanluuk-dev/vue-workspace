/**
 * Open Banking API Client (base)
 * Abstrakt HTTP-klient för autentisering, retry och headers.
 */

export interface ApiClientConfig {
  baseUrl: string;
  accessToken?: string;
  timeout?: number;
}

export abstract class OpenBankingApiClient {
  protected baseUrl: string;
  protected accessToken?: string;
  protected timeout: number;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.accessToken = config.accessToken;
    this.timeout = config.timeout ?? 10000;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  protected async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  protected async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  protected async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => 'Okänt fel');
      throw new Error(`Open Banking API-fel ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }
}
