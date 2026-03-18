import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'admin-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidenavComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {}
