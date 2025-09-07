import { ChangeDetectionStrategy, Component, inject, OnInit, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from 'shared';
import { Credentials } from 'shared';
import { LoginFormControls } from './login.interface';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form: FormGroup<LoginFormControls> = new FormGroup<LoginFormControls>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });
  isSubmitted = false;

  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated() && this.authStore.ready() && !this.authStore.loading()) {
        this.router.navigate(['/posts']);
      }
    });
  }

  ngOnInit(): void {
    this.authStore.clearError();
    this.authStore.resetLoadingState();
    this.authStore.init();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.authStore.clearError();

    if (this.form.invalid) {
      return;
    }

    const credentials: Credentials = this.form.value as Credentials;
    this.authStore.loginWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
  }

  onGoogleLogin(): void {
    this.authStore.clearError();
    this.authStore.loginWithProvider({ provider: 'google' });
  }
}
