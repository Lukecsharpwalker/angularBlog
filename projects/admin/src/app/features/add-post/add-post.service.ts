import { inject, Injectable } from '@angular/core';
import { Post, PostInsert, PostUpdate, Tag } from 'shared';
import { SupabaseClient } from 'shared';

@Injectable()
export class AddPostService {
  supabaseClient = inject(SupabaseClient);

  async addPost(post: PostInsert & { tags?: Tag[] }): Promise<void> {
    const { tags, ...postData } = post;

    try {
      const { data: insertedPost, error: postError } = await this.supabaseClient.getClient
        .from('posts')
        .insert({ ...postData })
        .select('id')
        .single();

      if (postError) {
        console.error('Error inserting post:', postError);
        throw postError;
      }

      if (tags && tags.length > 0 && insertedPost) {
        const postTagInserts = tags.map(tag => ({
          post_id: insertedPost.id,
          tag_id: tag.id,
        }));

        const { error: tagError } = await this.supabaseClient.getClient
          .from('post_tags')
          .insert(postTagInserts);

        if (tagError) {
          console.error('Error inserting post tags:', tagError);
          throw tagError;
        }
      }

      console.log('Post created successfully with tags');
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    try {
      const { data, error } = await this.supabaseClient.getClient
        .from('posts')
        .select(
          `
          *,
          author:profiles(id,username,avatar_url),
          post_tags!inner(tags(id,name,color,icon)),
          comments(id,content,created_at,is_deleted,is_reported,author:profiles(id,username,avatar_url))
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch post:', error);
      throw error;
    }
  }

  async updatePost(id: string, post: PostUpdate & { tags?: Tag[] }): Promise<void> {
    const { tags, ...postData } = post;

    try {
      // Update the post
      const { error: postError } = await this.supabaseClient.getClient
        .from('posts')
        .update({ ...postData })
        .eq('id', id);

      if (postError) {
        console.error('Error updating post:', postError);
        throw postError;
      }

      // Handle tags if provided
      if (tags !== undefined) {
        // Get existing tags for comparison
        const { data: existingPostTags, error: fetchError } = await this.supabaseClient.getClient
          .from('post_tags')
          .select('tag_id')
          .eq('post_id', id);

        if (fetchError) {
          console.error('Error fetching existing post tags:', fetchError);
          throw fetchError;
        }

        const existingTagIds = (existingPostTags || []).map((pt: any) => pt.tag_id).sort();
        const newTagIds = tags.map((tag: Tag) => tag.id).sort();

        // Check if tags have actually changed using JSON comparison for better accuracy
        const tagsChanged = JSON.stringify(existingTagIds) !== JSON.stringify(newTagIds);

        if (tagsChanged) {
          console.log('Tags changed, updating...');

          // Delete existing post-tag relationships
          const { error: deleteError } = await this.supabaseClient.getClient
            .from('post_tags')
            .delete()
            .eq('post_id', id);

          if (deleteError) {
            console.error('Error deleting existing post tags:', deleteError);
            throw deleteError;
          }

          // Insert new post-tag relationships if tags exist
          if (tags.length > 0) {
            const postTagInserts = tags.map(tag => ({
              post_id: id,
              tag_id: tag.id,
            }));

            const { error: insertError } = await this.supabaseClient.getClient
              .from('post_tags')
              .insert(postTagInserts);

            if (insertError) {
              console.error('Error inserting new post tags:', insertError);
              throw insertError;
            }
          }
        } else {
          console.log('Tags unchanged, skipping tag update');
        }
      }

      console.log('Post updated successfully');
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  }

  async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await this.supabaseClient.getClient.from('tags').select('*');

      if (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      throw error;
    }
  }
}
