import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'web-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, BottomNavComponent],
  template: `
    <div class="min-h-screen relative">
      <div class="fixed inset-0 pointer-events-none"></div>

      <web-navbar class="relative z-10" />
      <main class="container relative mx-auto w-11/12 pt-8 pb-32 md:pb-8 lg:w-10/12 xl:w-8/12">
        <router-outlet />
      </main>

      <web-bottom-nav />
    </div>
  `,
})
export class MainLayoutComponent {}
