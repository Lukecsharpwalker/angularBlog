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
  styleUrl: './login.component.scss',
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
      console.log('Effect triggered:', {
        isAuthenticated: this.authStore.isAuthenticated(),
        ready: this.authStore.ready(),
        loading: this.authStore.loading(),
        session: this.authStore.session?.()?.user?.email
      });
      
      if (this.authStore.isAuthenticated() && this.authStore.ready() && !this.authStore.loading()) {
        console.log('Navigating to /posts');
        this.router.navigate(['/posts']);
      }
    });
  }

  ngOnInit(): void {
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
