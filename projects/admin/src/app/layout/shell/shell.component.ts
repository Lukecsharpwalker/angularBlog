import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="admin-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .admin-main {
      min-height: 100vh;
      padding: 1rem;
    }
  `]
})
export class ShellComponent {}