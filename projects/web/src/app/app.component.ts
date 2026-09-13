import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'web-root',
  standalone: true,
  imports: [MainLayoutComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<web-main-layout/>',
})
export class AppComponent {}
