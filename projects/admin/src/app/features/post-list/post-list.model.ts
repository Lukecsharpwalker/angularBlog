import { Post } from '@shared/core/supabase';

export interface PostListRow extends Post {
  views: number;
}

export type PostStatusFilter = 'all' | 'published' | 'drafts';
