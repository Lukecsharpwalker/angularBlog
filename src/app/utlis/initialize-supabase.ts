import { SupabaseService } from '../services/supabase.service';

export function supabaseInitializer(supabase: SupabaseService): () => void {
  return () => {
    supabase.authChanges((_, session) => (supabase.session = session));
  };
}
