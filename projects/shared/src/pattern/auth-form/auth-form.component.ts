import { 
  ChangeDetectionStrategy, 
  Component, 
  input, 
  output, 
  inject, 
  effect, 
  OnInit 
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../data-access';
import { AuthFormService } from './auth-form.service';
import { AuthFormControls, AuthFormConfig } from './auth-form.interface';

@Component({
  selector: 'shared-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [AuthFormService],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent implements OnInit {
  readonly config = input<AuthFormConfig>({ showGoogleLogin: true, theme: 'web' });
  
  readonly loginSuccess = output<void>();
  readonly loginSubmit = output<{ email: string; password: string }>();
  readonly googleLogin = output<void>();

  readonly authStore = inject(AuthStore);
  
  isSubmitted = false;
  form!: FormGroup<AuthFormControls>;
  
  private readonly authFormService = inject(AuthFormService);

  constructor() {
    this.form = this.authFormService.createLoginForm();
    
    effect(() => {
      if (this.authStore.isAuthenticated() && this.authStore.ready() && !this.authStore.loading()) {
        this.loginSuccess.emit();
      }
    });
  }

  ngOnInit(): void {
    this.authFormService.initializeAuth();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.authFormService.clearError();

    if (this.authFormService.validateAndSubmitLogin(this.form)) {
      const formValue = this.form.value;
      this.loginSubmit.emit({
        email: formValue.email || '',
        password: formValue.password || ''
      });
    }
  }

  onGoogleLogin(): void {
    this.authFormService.loginWithProvider('google');
    this.googleLogin.emit();
  }

  get defaultConfig(): Required<AuthFormConfig> {
    const currentConfig = this.config();
    return {
      showGoogleLogin: currentConfig.showGoogleLogin ?? true,
      title: currentConfig.title ?? 'Welcome Back',
      subtitle: currentConfig.subtitle ?? 'Sign in to your account',
      submitButtonText: currentConfig.submitButtonText ?? 'Sign In',
      theme: currentConfig.theme ?? 'web'
    };
  }
}