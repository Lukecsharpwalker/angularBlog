import { InjectionToken } from '@angular/core';
import { AuthFormConfig } from './auth-form.interface';


export const DEFAULT_LOGIN_CONFIG: AuthFormConfig = {
  showGoogleLogin: true,
  title: 'Welcome Back',
  subtitle: 'Sign in to your account',
  submitButtonText: 'Sign In',
};

export const LOGIN_FORM_CONFIG = new InjectionToken<AuthFormConfig>(
  'LOGIN_FORM_CONFIG',
  {
    factory: () => DEFAULT_LOGIN_CONFIG,
  }
);
