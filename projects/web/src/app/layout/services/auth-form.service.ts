import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthStore } from 'shared';
import { Credentials } from 'shared';
import { LoginFormControls } from '../login/login.interface';

@Injectable()
export class AuthFormService {
  private authStore = inject(AuthStore);

  createLoginForm(): FormGroup<LoginFormControls> {
    return new FormGroup<LoginFormControls>({
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', { 
        nonNullable: true, 
        validators: [Validators.required] 
      }),
    });
  }

  validateAndSubmitLogin(form: FormGroup<LoginFormControls>): boolean {
    if (form.invalid) {
      return false;
    }

    const credentials: Credentials = form.value as Credentials;
    this.authStore.loginWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    return true;
  }

  loginWithProvider(provider: 'google'): void {
    this.authStore.clearError();
    this.authStore.loginWithProvider({ provider });
  }

  clearError(): void {
    this.authStore.clearError();
  }

  initializeAuth(): void {
    this.authStore.init();
  }
}