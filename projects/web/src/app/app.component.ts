import { Component } from '@angular/core';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'web-root',
  standalone: true,
  imports: [MainLayoutComponent],
  template: '<web-main-layout/>',
})
export class AppComponent {}
