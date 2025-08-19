import { Component } from '@angular/core';
import { ShellComponent } from './layout/shell/shell.component';

@Component({
  selector: 'admin-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<admin-shell></admin-shell>',
})
export class AppComponent {}
