import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { SUPABASE_CLIENT } from '@shared/core/supabase';
import { Profile } from '@shared/core/supabase/profiles';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly client = inject(SUPABASE_CLIENT);

  getProfile(userId: string | undefined): Observable<Profile | null> {
    return from(this.client.from('profiles').select('*').eq('id', userId).single()).pipe(
      map(({ data, error }) => (error ? null : data))
    );
  }
}
