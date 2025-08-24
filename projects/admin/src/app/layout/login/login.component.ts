import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginFormControls } from './login.interface';
import { SupabaseService } from 'shared';
import { Credentials } from 'shared';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  form = new FormGroup<LoginFormControls>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });
  isSubmitted = false;
  readonly loginError: WritableSignal<boolean> = signal(false);
  readonly isLoading: WritableSignal<boolean> = signal(false);

  private router = inject(Router);
  private supabaseService = inject(SupabaseService);

  onSubmit(): void {
    this.isSubmitted = true;
    this.loginError.set(false);

    if (this.form.invalid) {
      return;
    }

    const credentials = this.form.value as Credentials;
    this.isLoading.set(true);

    this.supabaseService
      .signInWithPassword(credentials.email, credentials.password)
      .then(({ error }) => {
        this.isLoading.set(false);
        console.log(error);
        console.log('Login successful:', credentials.email);
        if (error) {
          this.loginError.set(true);
          return;
        }

        this.loginError.set(false);
        this.router.navigate(['/posts']);
      })
      .catch(() => {
        this.isLoading.set(false);
        this.loginError.set(true);
      });
  }

  onGoogleLogin() {
    this.isLoading.set(true);
    this.supabaseService
      .signInWithProvider('google')
      .then(({ error }) => {
        this.isLoading.set(false);

        if (!error) {
          // Redirect to admin dashboard
          this.router.navigate(['/posts/add']);
        } else {
          this.loginError.set(true);
        }
      })
      .catch(() => {
        this.isLoading.set(false);
        this.loginError.set(true);
      });
  }
}
