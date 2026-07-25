import { inject, Injectable } from '@angular/core';
import { Post, Tag, SUPABASE_CLIENT } from '@shared/core/supabase';
import { PostInsert, PostUpdate } from './post-operations';

@Injectable({ providedIn: 'root' })
export class AddPostService {
  private readonly client = inject(SUPABASE_CLIENT);

  // BUT - we could use a Postgres function (RPC) to handle it in one call:
  //
  //   CREATE FUNCTION create_post_with_tags(
  //     post_data json,
  //     tag_ids int[]
  //   ) RETURNS posts AS $$
  //     -- Insert post
  //     -- Insert post_tags
  //     -- Return post with tags
  //   $$ LANGUAGE plpgsql;
  //
  //   Then call it:
  //   const { data } = await this.client.rpc('create_post_with_tags', {
  //     post_data: { title, content, ... },
  //     tag_ids: [1, 2, 3]
  //   });
  async addPost(post: PostInsert & { tags?: Tag[] }): Promise<Post> {
    const { tags = [], ...postData } = post;

    const { data: insertedPost, error } = await this.client
      .from('posts')
      .insert(postData)
      .select('*')
      .single();

    if (error) throw error;

    if (tags.length > 0) {
      const postTagRows = tags.map(tag => ({
        post_id: insertedPost.id,
        tag_id: tag.id,
      }));

      const { data: insertedPostTags, error: tagError } = await this.client
        .from('post_tags')
        .insert(postTagRows)
        .select('tags(*)');

      if (tagError) throw tagError;

      insertedPost.tags = (insertedPostTags ?? []).map(pt => pt.tags);
    } else {
      insertedPost.tags = [];
    }

    return insertedPost satisfies Post;
  }

  async getPostById(id: string): Promise<Post | null> {
    const { data, error } = await this.client
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
      const { error: postErr } = await this.client.from('posts').update(postData).eq('id', id);
      if (postErr) throw postErr;
    }

    if (tags === undefined) return;

    const { data: existing, error: fetchErr } = await this.client
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
      const { error: insErr } = await this.client.from('post_tags').insert(toInsert);
      if (insErr) throw insErr;
    }

    if (toDelete.length) {
      const { error: delErr } = await this.client
        .from('post_tags')
        .delete()
        .eq('post_id', id)
        .in('tag_id', toDelete);
      if (delErr) throw delErr;
    }
  }

  async getTags(): Promise<Tag[]> {
    const { data, error } = await this.client.from('tags').select('*');
    if (error) throw error;
    return data ?? [];
  }
}
