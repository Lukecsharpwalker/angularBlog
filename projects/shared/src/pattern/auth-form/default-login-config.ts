import { InjectionToken, Provider } from '@angular/core';
import { AuthFormConfig } from './auth-form.model';

export const DEFAULT_LOGIN_CONFIG: AuthFormConfig = {
  oauthProviders: ['google', 'github'],
  title: 'Welcome Back',
  subtitle: 'Sign in to your account',
  submitButtonText: 'Sign In',
};

export const LOGIN_FORM_CONFIG = new InjectionToken<AuthFormConfig>('LOGIN_FORM_CONFIG', {
  factory: () => DEFAULT_LOGIN_CONFIG,
});

export const provideLoginFormConfig = (config: AuthFormConfig): Provider => ({
  provide: LOGIN_FORM_CONFIG,
  useValue: { ...config },
});
