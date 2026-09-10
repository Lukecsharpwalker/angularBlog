import { afterNextRender, Component, inject, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { MobileBottomNavComponent } from '../mobile-bottom-nav/mobile-bottom-nav.component';
import { CookieConsentService } from '../cookie-consent/cookie-consent.service';

@Component({
  selector: 'web-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MobileBottomNavComponent],
  providers: [CookieConsentService],
  template: `
    <div class="min-h-screen relative">
      <div class="fixed inset-0 pointer-events-none"></div>

      <web-navbar class="relative z-10" />
      <main class="container relative mx-auto w-11/12 pt-8 pb-32 md:pb-8 lg:w-10/12 xl:w-8/12">
        <router-outlet />
      </main>

      <web-mobile-bottom-nav />
    </div>
  `,
})
export class MainLayoutComponent {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly cookieConsentService = inject(CookieConsentService);

  constructor() {
    this.initializeCookieConsent();
  }

  private initializeCookieConsent(): void {
    afterNextRender(async () => {
      if (this.cookieConsentService.needsConsent()) {
        await this.cookieConsentService.showConsentDialog(this.viewContainerRef);
      }
    });
  }
}
