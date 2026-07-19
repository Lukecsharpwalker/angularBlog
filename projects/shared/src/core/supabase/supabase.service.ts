import { inject, Injectable, InjectionToken, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { SUPABASE_CLIENT } from './supabase.client';
import { UserService } from '@shared/core/auth';
import { UserWithRole } from '@shared/core/auth/user.model';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG');

const APP_USER_TRANSFER_KEY = makeStateKey<UserWithRole | null>('app-user');

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly client = inject(SUPABASE_CLIENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userService = inject(UserService);
  private readonly transferState = inject(TransferState);

  async initializeAuth(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      await this.handleServerSideAuth();
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      this.handleClientSideAuth();
      return;
    }
  }

  private async handleServerSideAuth(): Promise<void> {
    if (!this.client) return;

    const { data } = await this.client.auth.getSession();
    if (data.session?.user) {
      const user = data.session.user as UserWithRole;
      this.userService.setAppUser(user);
      this.transferState.set(APP_USER_TRANSFER_KEY, user);
      return;
    }

    this.userService.setAppUser(null);
    this.transferState.set(APP_USER_TRANSFER_KEY, null);
  }

  private handleClientSideAuth(): void {
    if (this.transferState.hasKey(APP_USER_TRANSFER_KEY)) {
      const user = this.transferState.get(APP_USER_TRANSFER_KEY, null);
      this.userService.setAppUser(user);
      this.transferState.remove(APP_USER_TRANSFER_KEY);
      return;
    }

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
