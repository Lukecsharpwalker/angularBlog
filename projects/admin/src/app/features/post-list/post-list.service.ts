import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '@shared/core/supabase';

export interface PostListItem {
  id: string;
  title: string;
  created_at: Date | null;
  is_draft: boolean;
}

@Injectable()
export class PostListService {
  private readonly client = inject(SUPABASE_CLIENT);

  async getAllPosts(): Promise<PostListItem[]> {
    const { data, error } = await this.client
      .from('posts')
      .select('id, title, created_at, is_draft')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }
}
