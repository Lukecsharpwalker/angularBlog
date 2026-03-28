import { AuthTokenResponsePassword, Session } from '@supabase/supabase-js';
import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthFormControls } from './auth-form.interface';
import { Profile, SupabaseClient } from '@shared/core/supabase';

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
  protected readonly supabaseClient = inject(SupabaseClient);

  signInWithPassword(): Observable<Profile | null> {
    return this.supabaseClient.signInWithPassword(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
  }

  async loginWithProvider(provider: 'google'): Promise<void> {
    return;
  }

  clearError(): void {
    return;
  }
}
