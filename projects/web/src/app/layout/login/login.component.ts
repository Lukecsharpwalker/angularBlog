import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicDialogService, ModalCloseStatusEnum, ModalStatus } from '@shared/pattern/dynamic-dialog';
import { AuthFormComponent, AuthFormConfig } from '@shared/pattern/auth-form';

@Component({
  selector: 'web-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
//TODO: Back to separate ht,l but common logic
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
