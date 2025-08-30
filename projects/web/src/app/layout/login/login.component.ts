import { ChangeDetectionStrategy, Component, inject, effect, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogService } from 'shared';
import { AuthStore } from 'shared';
import { Credentials } from 'shared';
import { ModalCloseStatusEnum, ModalStatus } from 'shared';
import { LoginFormControls } from './login.interface';

@Component({
  selector: 'web-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form = new FormGroup<LoginFormControls>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });
  isSubmitted = false;

  readonly authStore = inject(AuthStore);
  private readonly dynamicDialogService = inject(DynamicDialogService);

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated() && this.authStore.ready() && !this.authStore.loading()) {
        const status = {
          closeStatus: ModalCloseStatusEnum.ACCEPTED,
        } as ModalStatus;
        this.dynamicDialogService.closeDialog(status);
      }
    });
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

  ngOnInit(): void {
    this.authStore.init();
  }

  onGoogleLogin(): void {
    this.authStore.clearError();
    this.authStore.loginWithProvider({ provider: 'google' });
  }
}
