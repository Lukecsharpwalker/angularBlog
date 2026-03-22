import { ChangeDetectionStrategy, Component, inject, signal, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormComponent } from '@shared/pattern/auth-form';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [AuthFormComponent],
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
