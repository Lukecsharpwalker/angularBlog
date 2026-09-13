import { inject, injectAsync, Injectable } from '@angular/core';
import { Provider } from '@supabase/supabase-js';
import { from, tap } from 'rxjs';
import { UserWithRole } from '@shared/core/auth/user.model';
import { UserService } from '@shared/core/auth/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client = injectAsync(() =>
    import('@shared/core/supabase/supabase.client').then(m => m.SUPABASE_CLIENT)
  );
  private readonly userService = inject(UserService);

  signInWithPassword(email: string, password: string) {
    return from(
      this.client().then(client => client.auth.signInWithPassword({ email, password }))
    ).pipe(
      tap(({ data: { user } }) => {
        if (user) {
          this.userService.setAppUser(user as UserWithRole);
        }
      })
    );
  }

  signUp(email: string, password: string) {
    return this.client().then(client => client.auth.signUp({ email, password }));
  }

  signInWithProvider(provider: Provider) {
    return this.client().then(client =>
      client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.href },
      })
    );
  }

  signOut() {
    return from(this.client().then(client => client.auth.signOut())).pipe(
      tap(res => {
        if (!res.error) {
          this.userService.setAppUser(null);
        }
      })
    );
  }
}
