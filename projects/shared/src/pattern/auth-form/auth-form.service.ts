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

  validateAndSubmitLogin(form: FormGroup<AuthFormControls>): void {
    if (form.invalid) {
      return;
    }
    console.log('Submitting login form with values:', form.getRawValue());
    this.authStore.loginWithPassword(form.getRawValue());
  }

  loginWithProvider(provider: 'google'): void {
    this.authStore.clearError();
    this.authStore.loginWithProvider({ provider });
  }

  clearError(): void {
    this.authStore.clearError();
  }
}
