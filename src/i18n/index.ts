/**
 * VUE Internationalization
 * Currently Swedish only (Sweden market)
 */

import sv, { TranslationKeys } from './sv';

export type Language = 'sv';

const translations: Record<Language, TranslationKeys> = {
  sv,
};

let currentLanguage: Language = 'sv';

/**
 * Get translation for a key path
 * @example t('dashboard.greeting_morning') => 'God morgon'
 */
export function t(keyPath: string, params?: Record<string, string | number>): string {
  const keys = keyPath.split('.');
  let value: any = translations[currentLanguage];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Translation missing: ${keyPath}`);
      return keyPath;
    }
  }

  if (typeof value !== 'string') {
    return keyPath;
  }

  // Replace parameters like {days} with actual values
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  return value;
}

/**
 * Set current language
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

/**
 * Get current language
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Get all translations for current language
 */
export function getTranslations(): TranslationKeys {
  return translations[currentLanguage];
}

export { sv };
export type { TranslationKeys };
