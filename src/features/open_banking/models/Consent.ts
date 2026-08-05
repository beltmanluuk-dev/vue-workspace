/**
 * Open Banking Consent Model
 */

export type ConsentStatus = 'pending' | 'authorizing' | 'active' | 'expired' | 'revoked';

export interface Consent {
  id: string;
  providerId: string;
  userId: string;
  status: ConsentStatus;
  scopes: string[];
  expiresAt?: Date;
  authorizedAt?: Date;
  revokedAt?: Date;
  redirectUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ConsentRequest {
  providerId: string;
  userId: string;
  scopes: string[];
  redirectUrl: string;
  language?: string;
  countryCode?: string;
}
