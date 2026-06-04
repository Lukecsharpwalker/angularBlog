import { inject } from '@angular/core';
import { SupabaseService } from '@shared/core/supabase/supabase.service';

export function authInitializer(): void {
  const supabaseService = inject(SupabaseService);
  supabaseService.initializeAuth()
}
