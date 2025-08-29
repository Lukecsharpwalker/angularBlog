import { SupabaseClient } from '../../data-access/clients/supabase.client';

export function supabaseInitializer(supabase: SupabaseClient): () => void {
  return () => {
    supabase.authChanges((_, session) => (supabase.session = session));
  };
}
