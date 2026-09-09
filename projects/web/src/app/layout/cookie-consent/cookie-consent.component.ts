import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  DynamicDialogService,
  ModalCloseStatusEnum,
  ModalStatus,
} from '@shared/pattern/dynamic-dialog';
import { CookieConsentService } from './cookie-consent.service';
import { CookieCategory } from './cookies.model';
import { ToggleComponent } from '@shared/ui/toggle';

@Component({
  selector: 'web-cookie-consent',
  standalone: true,
  imports: [ToggleComponent],
  templateUrl: './cookie-consent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentComponent {
  protected readonly activeView = signal<'banner' | 'details'>('banner');
  protected readonly customConsent = signal<Record<string, boolean>>({});

  protected readonly cookieService = inject(CookieConsentService);
  protected readonly cookieCategories = this.cookieService.cookieCategories;
  private readonly dynamicDialogService = inject(DynamicDialogService);

  constructor() {
    this.initializeCustomConsent();
  }

  protected acceptAll(): void {
    this.cookieService.acceptAllCookies();
    const status: ModalStatus = {
      closeStatus: ModalCloseStatusEnum.ACCEPTED,
    };
    this.dynamicDialogService.closeDialog(status);
  }

  protected rejectAll(): void {
    this.cookieService.rejectAllCookies();
    const status: ModalStatus = {
      closeStatus: ModalCloseStatusEnum.REJECTED,
    };
    this.dynamicDialogService.closeDialog(status);
  }

  protected showCustomizeOptions(): void {
    this.activeView.set('details');
  }

  protected backToBanner(): void {
    this.activeView.set('banner');
  }

  protected saveCustomPreferences(): void {
    this.cookieService.saveCustomConsent(this.customConsent());
    const status: ModalStatus = {
      closeStatus: ModalCloseStatusEnum.ACCEPTED,
    };
    this.dynamicDialogService.closeDialog(status);
  }

  protected updateCategoryConsent(categoryId: string, consent: boolean): void {
    const current = this.customConsent();
    this.customConsent.set({
      ...current,
      [categoryId]: consent,
    });
  }

  protected getCategoryConsent(categoryId: string): boolean {
    const category = this.cookieCategories().find(c => c.id === categoryId);
    if (category?.required) return true;
    return this.customConsent()[categoryId] || false;
  }

  protected isCategoryRequired(category: CookieCategory): boolean {
    return category.required;
  }

  private initializeCustomConsent(): void {
    const defaultConsent: Record<string, boolean> = {};
    this.cookieCategories().forEach(category => {
      defaultConsent[category.id] = category.required;
    });
    this.customConsent.set(defaultConsent);
  }
}
