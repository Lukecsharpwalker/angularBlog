import { inject, Injectable } from '@angular/core';
import { Profile, SupabaseClient } from '@shared/core/supabase';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private supabase = inject(SupabaseClient);

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase.getClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
