import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';

@Component({
  selector: 'web-cookie-consent',
  standalone: true,
  imports: [NgClass],
  templateUrl: './cookie-consent.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentComponent {
  protected activeTab: 'consent' | 'details' | 'about' = 'consent';
  protected cookieGroups = [
    {
      name: "Authentication (Mandatory can't be dennied)",
      cookies: ['cookies-consent', 'firebase-heartbeat-database', 'firebaseLocalStorageDb'],
    },
  ];
  private dialogService = inject(DynamicDialogService);

  protected setActiveTab(tab: 'consent' | 'details' | 'about'): void {
    this.activeTab = tab;
  }
}
