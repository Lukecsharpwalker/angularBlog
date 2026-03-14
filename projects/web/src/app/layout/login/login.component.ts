import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DynamicDialogService,
  ModalCloseStatusEnum,
} from '@shared/pattern/dynamic-dialog';
import { AuthFormComponent } from '@shared/pattern/auth-form';

@Component({
  selector: 'web-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly dynamicDialogService = inject(DynamicDialogService);

  onLoginSuccess(): void {
    this.dynamicDialogService.close(ModalCloseStatusEnum.Success);
  }
}
