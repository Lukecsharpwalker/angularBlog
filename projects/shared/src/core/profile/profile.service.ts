import {
  inject,
  injectAsync,
  Injectable,
  Injector,
  makeStateKey,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { from, map, Observable, of, tap } from 'rxjs';
import { pendingUntilEvent } from '@angular/core/rxjs-interop';
import { Profile } from '@shared/core/supabase/profiles';

//TODO: Move supabase calls into wrapers to not double api calls logic like withTransferState<T> | https://github.com/Lukecsharpwalker/angularBlog/issues/103
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly client = injectAsync(() =>
    import('@shared/core/supabase/supabase.client').then(m => m.SUPABASE_CLIENT)
  );
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);

  getProfile(userId: string): Observable<Profile | null> {
    const PROFILE_TRANSFER_KEY = makeStateKey<Profile | null>(`profile-${userId}`);
    if (isPlatformServer(this.platformId)) {
      return from(
        this.client().then(client => client.from('profiles').select('*').eq('id', userId).single())
      ).pipe(
        map(({ data, error }) => (error ? null : data)),
        tap(profile => {
          this.transferState.set(PROFILE_TRANSFER_KEY, profile);
        }),
        pendingUntilEvent(this.injector)
      );
    }

    if (this.transferState.hasKey(PROFILE_TRANSFER_KEY)) {
      const profile = this.transferState.get(PROFILE_TRANSFER_KEY, null);
      this.transferState.remove(PROFILE_TRANSFER_KEY);
      return of(profile);
    }

    return from(
      this.client().then(client => client.from('profiles').select('*').eq('id', userId).single())
    ).pipe(
      map(({ data, error}) => (error ? null : data))
    );
  }
}
