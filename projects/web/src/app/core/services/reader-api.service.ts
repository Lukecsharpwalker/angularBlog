import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SupabaseService } from 'shared';
import { Comment, Post, Profile, Tag, PostTag } from 'shared';
import { createApiUrl } from 'shared';
import { environment } from '../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReaderApiService {
  supabaseService = inject(SupabaseService);
  http = inject(HttpClient);
  private readonly baseUrl = `${environment.supabaseUrl}/rest/v1/`;
  private readonly apiKey = environment.supabaseKey;
  private headers = new HttpHeaders({
    apikey: this.apiKey,
    Authorization: `Bearer ${this.apiKey}`,
    Accept: 'application/json',
  });

  getPost(id: string): Observable<Post> {
    const selectQuery = `
      *,
      author:profiles(id,username,avatar_url),
      post_tags!inner(tags(id,name,color,icon)),
      comments(id,content,created_at,is_deleted,is_reported,author:profiles(id,username,avatar_url))
    `
      .replace(/\s+/g, ' ')
      .trim();

    const params = new HttpParams().set('select', selectQuery).set('id', `eq.${id}`);

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    });

    return this.http
      .get<Post[]>(`${this.baseUrl}posts`, { headers, params })
      .pipe(map(results => results[0] ?? null));
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
    await this.supabaseService.getClient.from('comments').insert({ ...comment, post_id: postId });
  }

  async deleteComment(commentId: string, postId: string): Promise<void> {
    await this.supabaseService.getClient
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('post_id', postId);
  }

  getPosts(): Observable<Post[]> {
    const query = createApiUrl('posts')
      .select('*', 'author:profiles(id,username,avatar_url)', 'post_tags(tags(id,name,color,icon))')
      .where('is_draft', 'eq', false)
      .orderBy('created_at', 'desc')
      .build();

    return this.http.get<Post[]>(`${this.baseUrl}/${query}`, {
      headers: this.headers,
    });
  }

  async getProfiles(): Promise<Profile[] | null> {
    const { data: profiles, error } = await this.supabaseService.getClient
      .from('profiles')
      .select('*');
    return error ? null : profiles;
  }

  getTags(): Observable<Tag[] | null> {
    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<Tag[]>(`${this.baseUrl}tags`, { headers });
  }

  async getPostTags(postId: string): Promise<PostTag[] | null> {
    const { data: postTags, error } = await this.supabaseService.getClient
      .from('post_tags')
      .select('*, tags(*)')
      .eq('post_id', postId);
    return error ? null : postTags;
  }
}
