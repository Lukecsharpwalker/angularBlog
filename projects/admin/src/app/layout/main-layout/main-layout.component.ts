import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="admin-main">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .admin-main {
        min-height: 100vh;
        padding: 1rem;
      }
    `,
  ],
})
export class MainLayoutComponent {}
