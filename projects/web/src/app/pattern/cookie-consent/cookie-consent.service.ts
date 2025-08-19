import { Injectable, ViewContainerRef, inject } from '@angular/core';
import { ModalCloseStatusEnum, ModalStatus } from 'shared';
import { DynamicDialogService } from 'shared';
import { CookieConsentComponent } from './cookie-consent.component';
import { LocalStorageEnum } from 'shared';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  dialogService = inject(DynamicDialogService);

  showCookieConsent(viewContainerRef: ViewContainerRef): void {
    if (!localStorage.getItem(LocalStorageEnum.COOKIES_CONSENT)) {
      this.dialogService.openDialog(
        viewContainerRef,
        {
          primaryButton: 'Allow All',
          secondaryButton: 'Deny',
          title: 'Cookie Consent'
        },
        CookieConsentComponent,
      ).subscribe((status) => {
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

  acceptCookies() {
    localStorage.setItem(LocalStorageEnum.COOKIES_CONSENT, 'true');
  }

  denyCookies() {
    localStorage.setItem(LocalStorageEnum.COOKIES_CONSENT, 'false');
  }

  closePopup(closeStatus: ModalCloseStatusEnum) {
    const status = {
      closeStatus: closeStatus
    } as ModalStatus;
    this.dialogService.closeDialog(status);
  }
}
