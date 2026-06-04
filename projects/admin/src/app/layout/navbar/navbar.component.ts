import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/core/auth';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.signOut().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }
}
