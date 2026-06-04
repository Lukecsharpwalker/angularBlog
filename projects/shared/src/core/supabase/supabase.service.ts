import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { SUPABASE_CLIENT } from './supabase.client';
import { UserService } from '@shared/core/auth';
import { UserWithRole } from '@shared/core/auth/user.model';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG');

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly client = inject(SUPABASE_CLIENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userService = inject(UserService);

  initializeAuth(): void {
    if (isPlatformServer(this.platformId)) {
      this.handleServerSideAuth();
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      this.handleClientSideAuth();
      return;
    }
  }

  private handleServerSideAuth() {
    console.warn('Server-side authentication is not implemented yet.');
  }

  private handleClientSideAuth() {
    this.client.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          this.userService.setAppUser(null);
          return;
        }
        if (!session || !session.user) {
          this.userService.setAppUser(null);
          return;
        }
        if (session.user) {
          this.userService.setAppUser(session.user as UserWithRole);
          return;
        }
      })
      .catch(() => {
        this.userService.setAppUser(null);
      });
  }
}
