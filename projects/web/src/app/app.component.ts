import { Component } from '@angular/core';
import { MainLayoutComponent } from './layout';

@Component({
  selector: 'web-root',
  standalone: true,
  imports: [MainLayoutComponent],
  template: '<web-main-layout></web-main-layout>',
})
export class AppComponent {}
