import { Injectable, ViewContainerRef, inject } from '@angular/core';
import { CookieConsentComponent } from './cookie-consent.component';
import { DynamicDialogService } from 'shared';
import { ModalCloseStatusEnum, ModalStatus } from 'shared';
import { LocalStorageEnum } from './local-storage';

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  dialogService = inject(DynamicDialogService);

  showCookieConsent(viewContainerRef: ViewContainerRef): void {
    if (!localStorage.getItem(LocalStorageEnum.COOKIES_CONSENT)) {
      this.dialogService
        .openDialog(
          viewContainerRef,
          {
            primaryButton: 'Allow All',
            secondaryButton: 'Deny',
            title: 'Cookie Consent',
          },
          CookieConsentComponent
        )
        .subscribe(status => {
          if (status.closeStatus === ModalCloseStatusEnum.ACCEPTED) {
            this.acceptCookies();
          }
          if (status.closeStatus === ModalCloseStatusEnum.REJECTED) {
            this.denyCookies();
          }
          this.closePopup(status.closeStatus);
        });
    }
  }

  acceptCookies(): void {
    localStorage.setItem(LocalStorageEnum.COOKIES_CONSENT, 'true');
  }

  denyCookies(): void {
    localStorage.setItem(LocalStorageEnum.COOKIES_CONSENT, 'false');
  }

  closePopup(closeStatus: ModalCloseStatusEnum): void {
    const status = {
      closeStatus: closeStatus,
    } as ModalStatus;
    this.dialogService.closeDialog(status);
  }
}
