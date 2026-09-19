import { inject, Injectable } from '@angular/core';
import { Provider } from '@supabase/supabase-js';
import { from } from 'rxjs';
import { SUPABASE_CLIENT } from '@shared/core/supabase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client = inject(SUPABASE_CLIENT);

  signInWithPassword(email: string, password: string) {
    return from(this.client.auth.signInWithPassword({ email, password }));
  }

  signUp(email: string, password: string) {
    return this.client.auth.signUp({ email, password });
  }

  signInWithProvider(provider: Provider) {
    return this.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.href },
    });
  }

  signOut() {
    return from(this.client.auth.signOut());
  }
}
