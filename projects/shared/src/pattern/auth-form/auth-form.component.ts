import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthFormService } from './auth-form.service';
import { LOGIN_FORM_CONFIG } from './default-login-config';
import { OAUTH_PROVIDER_LABELS, OAuthProviderId } from './auth-form.model';

@Component({
  selector: 'shared-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage],
  providers: [AuthFormService],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  readonly loginSuccess = output<void>();
  protected readonly config = inject(LOGIN_FORM_CONFIG);
  protected readonly oauthProviders: OAuthProviderId[] = this.config.oauthProviders ?? [];
  protected readonly providerLabels = OAUTH_PROVIDER_LABELS;
  protected readonly isSubmitted = signal(false);
  protected readonly form = inject(AuthFormService).loginForm;
  protected readonly errorMsg: WritableSignal<string | null> = signal(null);

  private readonly authFormService = inject(AuthFormService);

  onSubmit(): void {
    this.isSubmitted.set(true);

    this.authFormService
      .signInWithPassword()
      .pipe(finalize(() => this.isSubmitted.set(false)))
      .subscribe(res => {
        if (res.error) {
          this.authFormService.clearForm();
          this.errorMsg.set(res.error.message);
        }
        if (res.data.user) {
          this.loginSuccess.emit();
        }
      });
  }

  onProviderLogin(provider: OAuthProviderId): void {
    void this.authFormService.loginWithProvider(provider);
  }
}
