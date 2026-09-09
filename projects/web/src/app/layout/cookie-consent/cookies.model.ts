export enum LocalStorageEnum {
  COOKIES_CONSENT = 'cookies-consent',
  CONSENT_RECORD = 'cookie-consent-record',
}

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: string[];
}

export interface ConsentRecord {
  timestamp: string;
  version: string;
  categories: Record<string, boolean>;
  ipAddress?: string;
  userAgent: string;
  expiryDate: string;
}

export enum CookieCategoryEnum {
  NECESSARY = 'necessary',
  FUNCTIONAL = 'functional',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
}
