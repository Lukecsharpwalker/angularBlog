import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
  readonly loginSuccess = output<void>();
  protected readonly config = inject(LOGIN_FORM_CONFIG);
  protected readonly isSubmitted = signal(false);
  protected readonly form = inject(AuthFormService).loginForm;

  private readonly authFormService = inject(AuthFormService);

  onSubmit(): void {
    this.isSubmitted.set(true);
    this.authFormService.clearError();
    this.authFormService.signInWithPassword().subscribe(res => {
      if (res) {
        this.loginSuccess.emit();
      } else {
        //TODO DALEJ
        this.isSubmitted.set(false);
      }
    });
  }

  async onGoogleLogin(): Promise<void> {
    await this.authFormService.loginWithProvider('google');
    this.loginSuccess.emit();
  }
}
