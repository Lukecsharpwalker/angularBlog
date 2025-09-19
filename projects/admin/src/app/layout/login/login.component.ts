import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormComponent, AuthFormConfig } from '@shared/pattern/auth-form';
import { IconComponent } from '@shared/pattern/icon-system';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [AuthFormComponent, IconComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly authFormConfig: AuthFormConfig = {
    showGoogleLogin: true,
    title: 'Welcome Back, Administrator',
    subtitle: 'Access your premium control center',
    submitButtonText: 'Enter Dashboard',
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
