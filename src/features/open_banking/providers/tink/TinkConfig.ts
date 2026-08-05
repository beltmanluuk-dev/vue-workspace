/**
 * Tink Configuration (placeholders)
 * Ingen hårdkodad känslig information. Värden läses från miljö eller secure storage.
 */

export interface TinkEnvironmentConfig {
  baseUrl: string;
  clientId: string;
  redirectUrl: string;
  environment: 'sandbox' | 'production';
}

export const tinkSandboxConfig: TinkEnvironmentConfig = {
  baseUrl: 'https://api.tink.com',
  clientId: 'TINK_CLIENT_ID_PLACEHOLDER',
  redirectUrl: 'vue://tink/callback',
  environment: 'sandbox',
};

export function getTinkConfig(): TinkEnvironmentConfig {
  const envBaseUrl = typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_TINK_BASE_URL : undefined;
  const envClientId = typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_TINK_CLIENT_ID : undefined;
  const envRedirectUrl = typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_TINK_REDIRECT_URL : undefined;
  const envEnvironment = typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_TINK_ENVIRONMENT : undefined;

  return {
    baseUrl: envBaseUrl || tinkSandboxConfig.baseUrl,
    clientId: envClientId || tinkSandboxConfig.clientId,
    redirectUrl: envRedirectUrl || tinkSandboxConfig.redirectUrl,
    environment: (envEnvironment as 'sandbox' | 'production') || tinkSandboxConfig.environment,
  };
}
