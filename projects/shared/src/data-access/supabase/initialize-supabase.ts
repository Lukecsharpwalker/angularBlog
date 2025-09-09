import { SupabaseClient } from '../clients/supabase.client';

export function supabaseInitializer(supabase: SupabaseClient): () => void {
  return () => {
    supabase.authChanges((_, session) => (supabase.session = session));
  };
}
