import { inject, Injectable } from '@angular/core';
import { Provider } from '@supabase/supabase-js';
import { from, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '@shared/core/supabase';
import { UserWithRole } from '@shared/core/auth/user.model';
import { UserService } from '@shared/core/auth/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client = inject(SUPABASE_CLIENT);
  private readonly userService = inject(UserService);

  signInWithPassword(email: string, password: string) {
    return from(this.client.auth.signInWithPassword({ email, password })).pipe(
      tap(({ data: { user } }) => {
        if (user) {
          this.userService.setAppUser(user as UserWithRole);
        }
      })
    );
  }

  signUp(email: string, password: string) {
    return this.client.auth.signUp({ email, password });
  }

  signInWithProvider(provider: Provider) {
    return this.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  }

  signOut() {
    return from(this.client.auth.signOut()).pipe(
      tap((res) => {
        if (!res.error) {
          this.userService.setAppUser(null);
        }
      })
    );
  }
}
