import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormComponent, AuthFormConfig } from 'shared';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly authFormConfig: AuthFormConfig = {
    showGoogleLogin: true,
    title: 'Welcome Back',
    subtitle: 'Access your admin dashboard',
    submitButtonText: 'Sign In',
    theme: 'admin'
  };

  private readonly router = inject(Router);

  onLoginSuccess(): void {
    this.router.navigate(['/posts']);
  }

  onLoginSubmit(event: { email: string; password: string }): void {
    // TODO: Implement login logic with event.email and event.password
    void event;
  }

  onGoogleLogin(): void {
    void 0;
  }
}
