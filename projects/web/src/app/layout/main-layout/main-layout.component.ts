import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'web-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <web-navbar></web-navbar>
    <div class="container mx-auto w-11/12 lg:w-10/12 xl:w-8/12">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class MainLayoutComponent {}
