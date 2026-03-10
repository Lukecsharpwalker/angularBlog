import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { filter, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DynamicDialogService,
  ModalCloseStatusEnum,
  ModalStatus,
} from '@shared/pattern/dynamic-dialog';
import { AuthFormComponent } from '@shared/pattern/auth-form';
import { AuthStore } from '@shared/core/auth';

@Component({
  selector: 'web-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly dynamicDialogService = inject(DynamicDialogService);
  private readonly authStore = inject(AuthStore);

  constructor() {
    toObservable(this.authStore.isAuthenticated)
      .pipe(filter(Boolean), take(1), takeUntilDestroyed())
      .subscribe(() => {
        const status = {
          closeStatus: ModalCloseStatusEnum.ACCEPTED,
        } as ModalStatus;
        this.dynamicDialogService.closeDialog(status);
      });
  }
}
