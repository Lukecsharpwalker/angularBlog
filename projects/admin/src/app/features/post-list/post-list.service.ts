import { inject, Injectable } from '@angular/core';
import { Post, SupabaseClient } from '@shared/core/supabase';

export interface PostListItem {
  id: string;
  title: string;
  created_at: Date | null;
  is_draft: boolean;
}

@Injectable()
export class PostListService {
  private supabase = inject(SupabaseClient);

  async getAllPosts(): Promise<PostListItem[]> {
    const { data, error } = await this.supabase.getClient
      .from('posts')
      .select('id, title, created_at, is_draft')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }
}
