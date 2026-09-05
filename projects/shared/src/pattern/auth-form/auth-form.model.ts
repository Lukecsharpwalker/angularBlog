import { FormControl } from '@angular/forms';

export interface AuthFormControls {
  email: FormControl<string>;
  password: FormControl<string>;
}

export type OAuthProviderId = 'google' | 'github' | 'linkedin_oidc';

export interface AuthFormConfig {
  oauthProviders?: OAuthProviderId[];
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
}

export const OAUTH_PROVIDER_LABELS: Record<OAuthProviderId, string> = {
  google: 'Google',
  github: 'GitHub',
  linkedin_oidc: 'LinkedIn',
};
