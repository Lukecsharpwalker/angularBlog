import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  inject,
  signal,
  WritableSignal,
  viewChild,
  afterNextRender,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DynamicDialogService } from 'shared';
import { LoginComponent } from '../login/login.component';

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
  public readonly navbar = viewChild<ElementRef<HTMLElement>>('navbar');
  public readonly mobileMenu = viewChild<ElementRef<HTMLElement>>('mobileMenu');
  public readonly isScrolled: WritableSignal<boolean> = signal(false);
  public readonly isMenuOpen: WritableSignal<boolean> = signal(false);
  public readonly navHeight: WritableSignal<number> = signal(0);

  private dynamicDialogService = inject(DynamicDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.initializeNavHeight();
    this.initializeScrollDetection();
  }

  signIn() {
    this.dynamicDialogService.openDialog<LoginComponent>(
      this.viewContainerRef,
      { title: 'Sign In' },
      LoginComponent
    );
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());

    if (this.isMenuOpen()) {
      setTimeout(() => {
        this.mobileMenu()?.nativeElement.style.setProperty('top', `${this.navHeight()}px`);
      }, 1);
    }
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

      // Clean up event listener when component is destroyed
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', scrollHandler);
      });
    });
  }
}
