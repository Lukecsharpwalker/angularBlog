import { Component } from '@angular/core';
import { ShellComponent } from './layout/shell/shell.component';

@Component({
  selector: 'web-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<web-main-layout></web-main-layout>',
})
export class AppComponent {}
