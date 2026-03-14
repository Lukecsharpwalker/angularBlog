import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthStore } from '@shared/core/auth';
import { AuthFormControls } from './auth-form.interface';

@Injectable()
export class AuthFormService {
  readonly loginForm = new FormGroup<AuthFormControls>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private authStore = inject(AuthStore);

  async validateAndSubmitLogin(form: FormGroup<AuthFormControls>): Promise<void> {
    if (form.invalid) {
      return;
    }
    await this.authStore.loginWithPassword(form.getRawValue());
  }

  async loginWithProvider(provider: 'google'): Promise<void> {
    this.authStore.clearError();
    await this.authStore.loginWithProvider(provider);
  }

  clearError(): void {
    this.authStore.clearError();
  }
}
