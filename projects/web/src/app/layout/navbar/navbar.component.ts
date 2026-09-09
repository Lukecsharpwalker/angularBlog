import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '@shared/core/auth';
import { ProfileStore } from '../../core';
import { IconComponent } from '@shared/pattern/icon-system';
import { AutofocusDirective } from './autofocus.directive';
import { ObserveScrolledDirective } from './observe-scrolled.directive';

type NavbarPanel = 'menu' | 'search';

@Component({
  selector: 'web-navbar',
  standalone: true,
  imports: [RouterLink, IconComponent, AutofocusDirective, ObserveScrolledDirective],
  providers: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.z-30]': 'openPanel() !== null',
    '(document:keydown.escape)': 'closePanelAndRestoreFocusToMenuItem()',
    '(document:click)': 'closePanelOnOutsideClick($event.target)',
  },
})
export class NavbarComponent {
  protected readonly userName = inject(ProfileStore).userName;

  protected readonly openPanel = signal<NavbarPanel | null>(null);
  protected readonly searchQuery = signal('');

  private readonly menuToggleButton = viewChild<ElementRef<HTMLButtonElement>>('menuToggleButton');
  private readonly searchToggleButton =
    viewChild<ElementRef<HTMLButtonElement>>('searchToggleButton');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly dynamicDialogService = inject(DynamicDialogService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  protected signIn(): void {
    this.dynamicDialogService.openDialog<LoginComponent>(
      this.viewContainerRef,
      { variant: 'casual' },
      LoginComponent
    );
  }

  protected logout(): void {
    this.authService.signOut().subscribe();
  }

  protected togglePanel(panel: NavbarPanel): void {
    this.openPanel.update(open => (open === panel ? null : panel));
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected closePanelAndRestoreFocusToMenuItem(): void {
    const panel = this.openPanel();
    if (!panel) {
      return;
    }

    this.openPanel.set(null);

    const toggleButton = panel === 'menu' ? this.menuToggleButton() : this.searchToggleButton();
    toggleButton?.nativeElement.focus();
  }

  protected closePanelOnOutsideClick(target: Node | null): void {
    if (!this.host.nativeElement.contains(target)) {
      this.openPanel.set(null);
    }
  }
}
