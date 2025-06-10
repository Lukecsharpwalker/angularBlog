import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post, PostInsert, PostUpdate, Tag } from '../../supabase-types';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SupabaseService } from '../../services/supabase.service';
import { environment } from '../../../environments/environment.local';

@Injectable()
export class AdminApiService {
  http = inject(HttpClient);
  supabaseService = inject(SupabaseService);
  private readonly baseUrl = `${environment.supabaseUrl}/rest/v1/`;
  private readonly apiKey = environment.supabaseKey;

  async addPost(post: PostInsert & { tags?: Tag[] }): Promise<void> {
    const { tags, ...postData } = post;

    try {
      const { data: insertedPost, error: postError } = await this.supabaseService.getClient
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
          tag_id: tag.id
        }));

        const { error: tagError } = await this.supabaseService.getClient
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

  getPostById(id: string): Observable<Post> {
    const selectQuery = `
      *,
      author:profiles(id,username,avatar_url),
      post_tags!inner(tags(id,name,color,icon)),
      comments(id,content,created_at,is_deleted,is_reported,author:profiles(id,username,avatar_url))
    `
      .replace(/\s+/g, ' ')
      .trim();

    const params = new HttpParams()
      .set('select', selectQuery)
      .set('id', `eq.${id}`);

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    });

    return this.http
      .get<Post[]>(`${this.baseUrl}posts`, { headers, params })
      .pipe(map((results) => results[0] ?? null));
  }

  async updatePost(id: string, post: PostUpdate & { tags?: Tag[] }): Promise<void> {
    const { tags, ...postData } = post;

    try {
      // Update the post
      const { error: postError } = await this.supabaseService.getClient
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
        const { data: existingPostTags, error: fetchError } = await this.supabaseService.getClient
          .from('post_tags')
          .select('tag_id')
          .eq('post_id', id);

        if (fetchError) {
          console.error('Error fetching existing post tags:', fetchError);
          throw fetchError;
        }

        const existingTagIds = (existingPostTags || []).map(pt => pt.tag_id).sort();
        const newTagIds = tags.map(tag => tag.id).sort();

        // Check if tags have actually changed using JSON comparison for better accuracy
        const tagsChanged = JSON.stringify(existingTagIds) !== JSON.stringify(newTagIds);

        if (tagsChanged) {
          console.log('Tags changed, updating...');

          // Delete existing post-tag relationships
          const { error: deleteError } = await this.supabaseService.getClient
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
              tag_id: tag.id
            }));

            const { error: insertError } = await this.supabaseService.getClient
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
}
