import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthFormControls } from './auth-form.interface';
import { AuthService } from '@shared/core/auth';

@Injectable()
export class AuthFormService {
  readonly loginForm = new FormGroup<AuthFormControls>({
    email: new FormControl<string>('a', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  protected readonly authService = inject(AuthService);

  signInWithPassword(): Observable<AuthTokenResponsePassword> {
    return this.authService.signInWithPassword(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
  }

  async loginWithProvider(): Promise<void> {
    return;
  }

  clearForm(): void {
    this.loginForm.reset();
  }
}
