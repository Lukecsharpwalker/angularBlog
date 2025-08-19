import { SupabaseService } from '../services';

export function supabaseInitializer(supabase: SupabaseService): () => void {
  return () => {
    supabase.authChanges((_, session) => (supabase.session = session));
  };
}