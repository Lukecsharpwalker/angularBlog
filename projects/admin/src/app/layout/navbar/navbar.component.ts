import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/core/auth';
import { IconComponent } from '@shared/pattern/icon-system';
import { ADMIN_ROUTE } from '../../core/routing/admin-routes';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.authService.signOut().subscribe(() => {
      void this.router.navigate([ADMIN_ROUTE.login]);
    });
  }
}
