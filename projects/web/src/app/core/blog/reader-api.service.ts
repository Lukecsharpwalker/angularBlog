import { inject, Injectable, PendingTasks } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, map, Observable } from 'rxjs';
import { Comment, Post, Profile, Tag, PostTag, SUPABASE_CLIENT } from '@shared/core/supabase';
import { createApiUrl } from '../../utils/api/url-builder';
import { environment } from '../../../../../../environments/environment';
import { pendingUntilEvent } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ReaderApiService {
  private readonly client = inject(SUPABASE_CLIENT);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.supabaseUrl}/rest/v1/`;
  private readonly apiKey = environment.supabaseKey;
  private headers = new HttpHeaders({
    apikey: this.apiKey,
    Authorization: `Bearer ${this.apiKey}`,
    Accept: 'application/json',
  });

  private pendingTasks = inject(PendingTasks);

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
    const { data: comments, error } = await this.client
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return error ? [] : comments;
  }

  async addComment(postId: string, comment: Comment): Promise<void> {
    await this.client.from('comments').insert({ ...comment, post_id: postId });
  }

  async deleteComment(commentId: string, postId: string): Promise<void> {
    await this.client.from('comments').delete().eq('id', commentId).eq('post_id', postId);
  }

  getPosts(): Observable<Post[]> {
    return from(
      this.client
        .from('posts')
        .select('*, author:profiles(id,username,avatar_url), post_tags(tags(id,name,color,icon))')
        .eq('is_draft', false)
        .order('created_at', { ascending: false })
    ).pipe(
      map(x => (x.error ? [] : x.data)),
      pendingUntilEvent()
    );

    // const query = createApiUrl('posts')
    //   .select('*', 'author:profiles(id,username,avatar_url)', 'post_tags(tags(id,name,color,icon))')
    //   .where('is_draft', 'eq', false)
    //   .orderBy('created_at', 'desc')
    //   .build();
    //
    // return this.http.get<Post[]>(`${this.baseUrl}/${query}`, {
    //   headers: this.headers,
    // });
  }

  async getProfiles(): Promise<Profile[] | null> {
    const { data: profiles, error } = await this.client.from('profiles').select('*');
    return error ? null : profiles;
  }

  async getProfileById(userId: string): Promise<Profile | null> {
    const { data: profile, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return error ? null : profile;
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
    const { data: postTags, error } = await this.client
      .from('post_tags')
      .select('*, tags(*)')
      .eq('post_id', postId);
    return error ? null : postTags;
  }
}
