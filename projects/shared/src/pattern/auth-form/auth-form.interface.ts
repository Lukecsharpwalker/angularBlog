import { FormControl } from '@angular/forms';

export interface AuthFormControls {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface AuthFormConfig {
  showGoogleLogin?: boolean;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  theme?: 'web' | 'admin';
}

export interface AuthFormEvents {
  loginSuccess: void;
  loginSubmit: { email: string; password: string };
  googleLogin: void;
}