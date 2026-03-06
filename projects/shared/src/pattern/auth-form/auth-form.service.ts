import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthStore, Credentials } from '@shared/core/auth';
import { AuthFormControls } from '@shared/pattern/auth-form/auth-form.interface';


@Injectable()
export class AuthFormService {
  private authStore = inject(AuthStore);

  createLoginForm(): FormGroup<AuthFormControls> {
    return new FormGroup<AuthFormControls>({
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  validateAndSubmitLogin(form: FormGroup<AuthFormControls>): boolean {
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
