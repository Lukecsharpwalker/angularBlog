import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'web-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <web-navbar></web-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 64px); /* Assuming navbar height */
    }
  `]
})
export class ShellComponent {}