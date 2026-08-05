/**
 * Tink Authentication Service (placeholder)
 */

import { TinkApiClient } from '../../api';
import { getTinkConfig } from './TinkConfig';

export class TinkAuthService {
  private apiClient: TinkApiClient;

  constructor() {
    const config = getTinkConfig();
    this.apiClient = new TinkApiClient({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      redirectUrl: config.redirectUrl,
    });
  }

  public buildAuthorizationUrl(scopes: string[], state: string): string {
    const config = getTinkConfig();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUrl,
      response_type: 'code',
      state,
      scope: scopes.join(' '),
    });
    return `${config.baseUrl}/api/v1/oauth/authorize?${params.toString()}`;
  }

  public async exchangeCode(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await this.apiClient.exchangeCodeForToken(code);
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  }
}
