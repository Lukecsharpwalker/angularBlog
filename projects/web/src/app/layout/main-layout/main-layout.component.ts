import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'web-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-quaternary via-tertiary/20 to-secondary/10">
      <web-navbar />
      <main class="container mx-auto w-11/12 lg:w-10/12 xl:w-8/12 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {}
