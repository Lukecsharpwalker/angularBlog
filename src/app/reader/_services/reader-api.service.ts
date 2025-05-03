import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Comment, Post, Profile, Tag, PostTag } from '../../types/supabase';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReaderApiService {
  supabaseService = inject(SupabaseService);
  http = inject(HttpClient);
  private readonly baseUrl =
    'https://aqdbdmepncxxuanlymwr.supabase.co/rest/v1/posts';
  private readonly apiKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZGJkbWVwbmN4eHVhbmx5bXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTA0MjYsImV4cCI6MjA2MDYyNjQyNn0.RNtZZ4Of4LIP3XuS9lumHYdjRLVUGXARtAxaTJmF7lc';

  getPost(id: string): Observable<Post> {
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
      .get<Post[]>(this.baseUrl, { headers, params })
      .pipe(map((results) => results[0] ?? null));
  }

  async getComments(postId: string): Promise<Comment[]> {
    const { data: comments, error } = await this.supabaseService.getClient
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return error ? [] : comments;
  }

  async addComment(postId: string, comment: Comment): Promise<void> {
    const { error } = await this.supabaseService.getClient
      .from('comments')
      .insert({ ...comment, post_id: postId });
  }

  async deleteComment(commentId: string, postId: string): Promise<void> {
    const { error } = await this.supabaseService.getClient
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('post_id', postId);
  }

  getPosts(): Observable<Post[] | null> {
    const selectQuery = `
      *,
      author:profiles(id,username,avatar_url),
      post_tags(tags(id,name,color,icon))
    `
      .replace(/\s+/g, ' ')
      .trim();

    const params = new HttpParams()
      .set('select', selectQuery)
      .set('is_draft', 'eq.false')
      .set('order', 'created_at.desc');

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    });

    return this.http.get<Post[]>(this.baseUrl, { headers, params });
  }

  // async getPosts(): Promise<Post[] | null> {
  //   const { data: posts } = await this.supabaseService.getClient
  //     .from('posts')
  //     .select(
  //       `
  //       *,
  //       author:profiles ( id, username, avatar_url ),
  //       post_tags (
  //         tags ( id, name, color, icon )
  //       )
  //     `,
  //     )
  //     .eq('is_draft', false)
  //     .order('created_at', { ascending: false });
  //
  //   return posts;
  // }

  async getProfiles(): Promise<Profile[] | null> {
    const { data: profiles, error } = await this.supabaseService.getClient
      .from('profiles')
      .select('*');
    return error ? null : profiles;
  }

  async getTags(): Promise<Tag[] | null> {
    const { data: tags, error } = await this.supabaseService.getClient
      .from('tags')
      .select('*');
    return error ? null : tags;
  }

  async getPostTags(postId: string): Promise<PostTag[] | null> {
    const { data: postTags, error } = await this.supabaseService.getClient
      .from('post_tags')
      .select('*, tags(*)')
      .eq('post_id', postId);
    return error ? null : postTags;
  }
}
