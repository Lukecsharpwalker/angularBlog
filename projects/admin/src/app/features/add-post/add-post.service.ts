import { inject, Injectable } from '@angular/core';
import { Post, PostInsert, PostUpdate, Tag } from 'shared';
import { SupabaseClient } from 'shared';

@Injectable({ providedIn: 'root' })
export class AddPostService {
  private supabase = inject(SupabaseClient);

  async addPost(post: PostInsert & { tags?: Tag[] }): Promise<string> {
    const { tags = [], ...postData } = post;

    const { data: inserted, error } = await this.supabase.getClient
      .from('posts')
      .insert(postData)
      .select('id')
      .single();

    if (error) throw error;
    const postId = inserted.id;

    if (tags.length) {
      const rows = tags.map(t => ({ post_id: postId, tag_id: t.id as number }));
      const { error: relErr } = await this.supabase.getClient
        .from('post_tags')
        .upsert(rows, { onConflict: 'post_id,tag_id', ignoreDuplicates: true });
      if (relErr) throw relErr;
    }

    return postId;
  }

  async getPostById(id: string): Promise<Post | null> {
    const { data, error } = await this.supabase.getClient
      .from('posts')
      .select(
        `
    *,
    author:profiles(id,username,avatar_url),
    tags:tags!post_tags(id,name,color,icon),
    comments(id,content,created_at,is_deleted,is_reported,author:profiles(id,username,avatar_url))
  `
      )

      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updatePost(id: string, post: PostUpdate & { tags?: Tag[] }): Promise<void> {
    const { tags, ...postData } = post;

    if (Object.keys(postData).length) {
      const { error: postErr } = await this.supabase.getClient
        .from('posts')
        .update(postData)
        .eq('id', id);
      if (postErr) throw postErr;
    }

    if (tags === undefined) return;

    const { data: existing, error: fetchErr } = await this.supabase.getClient
      .from('post_tags')
      .select('tag_id')
      .eq('post_id', id);
    if (fetchErr) throw fetchErr;

    interface Row {
      tag_id: number;
    }
    const have = new Set<number>((existing ?? []).map((r: Row) => r.tag_id));
    const want = new Set<number>(tags.map(t => t.id as number));

    const toInsert = [...want]
      .filter(tagId => !have.has(tagId))
      .map(tag_id => ({ post_id: id, tag_id }));

    const toDelete = [...have].filter(tagId => !want.has(tagId));

    if (toInsert.length) {
      const { error: insErr } = await this.supabase.getClient.from('post_tags').insert(toInsert);
      if (insErr) throw insErr;
    }

    if (toDelete.length) {
      const { error: delErr } = await this.supabase.getClient
        .from('post_tags')
        .delete()
        .eq('post_id', id)
        .in('tag_id', toDelete);
      if (delErr) throw delErr;
    }
  }

  async getTags(): Promise<Tag[]> {
    const { data, error } = await this.supabase.getClient.from('tags').select('*');
    if (error) throw error;
    return data ?? [];
  }
}
