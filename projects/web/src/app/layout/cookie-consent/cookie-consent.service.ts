import { computed, inject, Injectable, signal, ViewContainerRef } from '@angular/core';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import {
  ConsentRecord,
  CookieCategory,
  CookieCategoryEnum,
  LocalStorageEnum,
} from './local-storage';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  readonly consentGiven = signal<Record<string, boolean>>({});
  readonly cookieCategories = signal<CookieCategory[]>([
    {
      id: CookieCategoryEnum.NECESSARY,
      name: 'Essential Cookies',
      description: 'Required for basic website functionality and security.',
      required: true,
      cookies: ['cookie-consent-record', 'session-id', 'csrf-token'],
    },
    {
      id: CookieCategoryEnum.FUNCTIONAL,
      name: 'Functional Cookies',
      description: 'Remember your preferences and settings.',
      required: false,
      cookies: ['language-preference', 'theme-preference', 'accessibility-settings'],
    },
    {
      id: CookieCategoryEnum.ANALYTICS,
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website.',
      required: false,
      cookies: ['_ga', '_ga_*', '_gid', 'amplitude-*'],
    },
    {
      id: CookieCategoryEnum.MARKETING,
      name: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements.',
      required: false,
      cookies: ['_fbp', '_fbc', 'ads-data', 'retargeting-pixels'],
    },
  ]);
  readonly hasValidConsent = computed(() => {
    const record = this.getConsentRecord();
    if (!record) return false;

    const expiryDate = new Date(record.expiryDate);
    const now = new Date();
    return expiryDate > now && record.version === this.CONSENT_VERSION;
  });

  private readonly CONSENT_VERSION = '2.1';
  private readonly CONSENT_EXPIRY_MONTHS = 6;
  private dynamicDialogService = inject(DynamicDialogService);

  constructor() {
    this.initializeConsent();
  }

  needsConsent(): boolean {
    return !this.hasValidConsent();
  }

  async showConsentDialog(viewContainerRef: ViewContainerRef): Promise<void> {
    if (typeof window === 'undefined') return;

    const { CookieConsentComponent } = await import('./cookie-consent.component');

    this.dynamicDialogService.openDialog(
      viewContainerRef,
      { title: 'Cookie Consent', variant: 'sheet' },
      CookieConsentComponent
    );
  }

  acceptAllCookies(): void {
    const consent: Record<string, boolean> = {};
    this.cookieCategories().forEach(category => {
      consent[category.id] = true;
    });
    this.saveConsent(consent);
  }

  rejectAllCookies(): void {
    const consent: Record<string, boolean> = {};
    this.cookieCategories().forEach(category => {
      consent[category.id] = category.required;
    });
    this.saveConsent(consent);
  }

  saveCustomConsent(categories: Record<string, boolean>): void {
    this.cookieCategories().forEach(category => {
      if (category.required) {
        categories[category.id] = true;
      }
    });
    this.saveConsent(categories);
  }

  withdrawConsent(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(LocalStorageEnum.CONSENT_RECORD);
      localStorage.removeItem(LocalStorageEnum.COOKIES_CONSENT);
    }
    this.consentGiven.set({});
  }

  getConsentStatus(categoryId: string): boolean {
    return this.consentGiven()[categoryId] || false;
  }

  private initializeConsent(): void {
    if (this.hasValidConsent()) {
      const record = this.getConsentRecord();
      if (record) {
        this.consentGiven.set(record.categories);
        this.applyConsentSettings(record.categories);
      }
    }
  }

  private saveConsent(categories: Record<string, boolean>): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + this.CONSENT_EXPIRY_MONTHS);

    const consentRecord: ConsentRecord = {
      timestamp: new Date().toISOString(),
      version: this.CONSENT_VERSION,
      categories,
      userAgent: navigator.userAgent,
      expiryDate: expiryDate.toISOString(),
    };

    localStorage.setItem(LocalStorageEnum.CONSENT_RECORD, JSON.stringify(consentRecord));
    localStorage.setItem(LocalStorageEnum.COOKIES_CONSENT, 'true');

    this.consentGiven.set(categories);
    this.applyConsentSettings(categories);
  }

  private getConsentRecord(): ConsentRecord | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const stored = localStorage.getItem(LocalStorageEnum.CONSENT_RECORD);
    if (!stored) return null;

    try {
      return JSON.parse(stored) as ConsentRecord;
    } catch {
      return null;
    }
  }

  private applyConsentSettings(categories: Record<string, boolean>): void {
    this.manageAnalyticsCookies(categories[CookieCategoryEnum.ANALYTICS]);
    this.manageMarketingCookies(categories[CookieCategoryEnum.MARKETING]);
    this.manageFunctionalCookies(categories[CookieCategoryEnum.FUNCTIONAL]);
  }

  private manageAnalyticsCookies(allowed: boolean): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: allowed ? 'granted' : 'denied',
      });
    }
  }

  private manageMarketingCookies(allowed: boolean): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: allowed ? 'granted' : 'denied',
        ad_user_data: allowed ? 'granted' : 'denied',
        ad_personalization: allowed ? 'granted' : 'denied',
      });
    }
  }

  private manageFunctionalCookies(allowed: boolean): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        functionality_storage: allowed ? 'granted' : 'denied',
      });
    }
  }
}
