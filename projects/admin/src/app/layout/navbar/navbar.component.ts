import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient } from '@shared/core/supabase';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly supabaseClient = inject(SupabaseClient);
  private readonly router = inject(Router);

  logout(): void {
    this.supabaseClient.signOut().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }
}
