import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicDialogService } from 'shared';
import { ModalCloseStatusEnum, ModalStatus } from 'shared';
import { AuthFormComponent, AuthFormConfig } from 'shared';

@Component({
  selector: 'web-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly authFormConfig: AuthFormConfig = {
    showGoogleLogin: true,
    title: 'Welcome Back',
    subtitle: 'Sign in to your account',
    submitButtonText: 'Sign In',
    theme: 'web'
  };

  private readonly dynamicDialogService = inject(DynamicDialogService);

  onLoginSuccess(): void {
    const status = {
      closeStatus: ModalCloseStatusEnum.ACCEPTED,
    } as ModalStatus;
    this.dynamicDialogService.closeDialog(status);
  }

  onLoginSubmit(event: { email: string; password: string }): void {
    // TODO: Implement login logic with event.email and event.password
    void event;
  }

  onGoogleLogin(): void {
    void 0;
  }
}
