import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  inject,
  signal,
  viewChild,
  afterNextRender,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { LoginComponent } from '../login/login.component';
import { CookieConsentService } from '../cookie-consent/cookie-consent.service';
import { SupabaseClient } from '@shared/core/supabase';

@Component({
  selector: 'web-navbar',
  standalone: true,
  imports: [RouterLink],
  providers: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly navbar = viewChild<ElementRef<HTMLElement>>('navbar');
  protected readonly mobileMenu = viewChild<ElementRef<HTMLElement>>('mobileMenu');
  protected readonly isScrolled = signal(false);
  protected readonly isMenuOpen = signal(false);
  protected readonly navHeight = signal(0);
  protected readonly searchQuery = signal('');
  protected readonly userProfile = inject(SupabaseClient).userProfile

  private readonly supabaseClient = inject(SupabaseClient);
  private dynamicDialogService = inject(DynamicDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);
  private cookieConsentService = inject(CookieConsentService);

  constructor() {
    this.initializeNavHeight();
    this.initializeScrollDetection();
    this.initializeCookieConsent();
  }

  protected signIn(): void {
    this.dynamicDialogService.openDialog<LoginComponent>(
      this.viewContainerRef,
      { title: 'Sign In' },
      LoginComponent
    );
  }

  protected logout(): void {
    this.supabaseClient.signOut().subscribe();
  }

  protected toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());

    if (this.isMenuOpen()) {
      setTimeout(() => {
        this.mobileMenu()?.nativeElement.style.setProperty('top', `${this.navHeight()}px`);
      }, 1);
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  private initializeNavHeight(): void {
    afterNextRender(() => {
      this.navHeight.set(this.navbar()?.nativeElement.scrollHeight ?? 0);
    });
  }

  private initializeScrollDetection(): void {
    afterNextRender(() => {
      const scrollHandler = () => {
        this.isScrolled.set(window.scrollY > 0);
      };

      window.addEventListener('scroll', scrollHandler, { passive: true });

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', scrollHandler);
      });
    });
  }

  private initializeCookieConsent(): void {
    afterNextRender(async () => {
      if (this.cookieConsentService.needsConsent()) {
        await this.cookieConsentService.showConsentDialog(this.viewContainerRef);
      }
    });
  }
}
