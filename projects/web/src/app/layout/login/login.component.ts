import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogService } from 'shared';
import { SupabaseService } from 'shared';
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
export class LoginComponent {
  form = new FormGroup<LoginFormControls>({
    email: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true }),
  });
  isSubmitted = false;
  readonly loginError: WritableSignal<boolean> = signal(false);

  private dynamicDialogService = inject(DynamicDialogService);
  private supabaseService = inject(SupabaseService);

  onSubmit(): void {
    this.isSubmitted = true;
    const credentials = this.form.value as Credentials;

    this.supabaseService
      .signInWithPassword(credentials.email, credentials.password)
      .then(({ error }) => {
        if (error) {
          this.loginError.set(true);
          return;
        }

        this.loginError.set(false);
        const status = {
          closeStatus: ModalCloseStatusEnum.ACCEPTED,
        } as ModalStatus;
        this.dynamicDialogService.closeDialog(status);
      })
      .catch(() => {
        this.loginError.set(true);
      });
  }

  onGoogleLogin() {
    this.supabaseService.signInWithProvider('google').then(({ error }) => {
      if (!error) {
        const status = {
          closeStatus: ModalCloseStatusEnum.ACCEPTED,
        } as ModalStatus;
        this.dynamicDialogService.closeDialog(status);
      }
    });
  }
}
