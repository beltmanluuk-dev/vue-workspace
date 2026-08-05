/**
 * Tink API Client (placeholder)
 * Bygger på OpenBankingApiClient. Använder placeholders för credentials.
 * Byt ut mot riktiga endpoints/nycklar när Tink-anslutningen aktiveras.
 */

import { OpenBankingApiClient } from './OpenBankingApiClient';

export interface TinkApiClientConfig {
  baseUrl: string;
  clientId: string;
  clientSecret?: string;
  redirectUrl: string;
}

export class TinkApiClient extends OpenBankingApiClient {
  private clientId: string;
  private clientSecret?: string;
  private redirectUrl: string;

  constructor(config: TinkApiClientConfig) {
    super({ baseUrl: config.baseUrl });
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUrl = config.redirectUrl;
  }

  public async exchangeCodeForToken(code: string): Promise<{ access_token: string; refresh_token: string }> {
    // Placeholder: byt ut mot Tink OAuth endpoint.
    return this.post<{ access_token: string; refresh_token: string }>('/api/v1/oauth/token', {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUrl,
      grant_type: 'authorization_code',
    });
  }
}
