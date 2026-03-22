import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthStore } from '@shared/core/auth';
import { AuthFormControls } from './auth-form.interface';
import { Session } from '@supabase/supabase-js';

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

  async validateAndSubmitLogin(form: FormGroup<AuthFormControls>): Promise<Session | void> {
      return await this.authStore.loginWithPassword(form.getRawValue());
  }

  async loginWithProvider(provider: 'google'): Promise<void> {
    this.authStore.clearError();
    return  this.authStore.loginWithProvider(provider);
  }

  clearError(): void {
    this.authStore.clearError();
  }
}
