import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@shared/core/auth';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/login']);
  }
}
