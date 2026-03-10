import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../core/auth';
import { AuthFormService } from './auth-form.service';
import { LOGIN_FORM_CONFIG } from './default-login-config';

@Component({
  selector: 'shared-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [AuthFormService],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  protected readonly config = inject(LOGIN_FORM_CONFIG);
  protected readonly authStore = inject(AuthStore);
  protected readonly isSubmitted = signal(false);
  protected readonly form = inject(AuthFormService).loginForm;

  private readonly authFormService = inject(AuthFormService);


  onSubmit(): void {
    this.isSubmitted.set(true);
    this.authFormService.clearError();
    this.authFormService.validateAndSubmitLogin(this.form);
  }

  onGoogleLogin(): void {
    this.authFormService.loginWithProvider('google');
  }
}
