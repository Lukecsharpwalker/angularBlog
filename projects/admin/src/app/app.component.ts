import { Component } from '@angular/core';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'admin-root',
  standalone: true,
  imports: [MainLayoutComponent],
  template: '<admin-main-layout/>',
})
export class AppComponent {}
