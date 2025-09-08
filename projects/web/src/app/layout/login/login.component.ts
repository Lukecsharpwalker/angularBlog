import { ChangeDetectionStrategy, Component, inject, effect, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogService } from 'shared';
import { AuthStore } from 'shared';
import { ModalCloseStatusEnum, ModalStatus } from 'shared';
import { LoginFormControls } from './login.interface';
import { AuthFormService } from '../services/auth-form.service';

@Component({
  selector: 'web-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [AuthFormService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  isSubmitted = false;
  form!: FormGroup<LoginFormControls>;

  private authFormService = inject(AuthFormService);
  private readonly dynamicDialogService = inject(DynamicDialogService);

  constructor() {
    this.form = this.authFormService.createLoginForm();
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
    this.authFormService.clearError();

    this.authFormService.validateAndSubmitLogin(this.form);
  }

  ngOnInit(): void {
    this.authFormService.initializeAuth();
  }

  onGoogleLogin(): void {
    this.authFormService.loginWithProvider('google');
  }
}
