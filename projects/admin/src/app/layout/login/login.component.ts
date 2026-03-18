import { ChangeDetectionStrategy, Component, inject, signal, VERSION } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthFormComponent } from '@shared/pattern/auth-form';
import { IconComponent } from '@shared/pattern/icon-system';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [AuthFormComponent, IconComponent, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly currentYear = signal(new Date().getFullYear());
  readonly angularVersion = signal(VERSION.major);

  private readonly router = inject(Router);

  onLoginSuccess(): void {
    this.router.navigate(['/']);
  }
}
