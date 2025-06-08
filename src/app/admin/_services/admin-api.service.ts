import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post } from '../../supabase-types';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SupabaseService } from '../../services/supabase.service';
import { environment } from '../../../environments/environment.local';

@Injectable()
export class AdminApiService {
  http = inject(HttpClient);
  supabaseService = inject(SupabaseService);
  private readonly baseUrl = `${environment.supabaseUrl}/rest/v1/`;
  private readonly apiKey = environment.supabaseKey;

  async addPost(post: Post): Promise<void> {
    const { error } = await this.supabaseService.getClient
      .from('posts')
      .insert({ ...post });
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

  async updatePost(id: string, post: Post): Promise<void> {
    await this.supabaseService.getClient
      .from('posts')
      .update({ ...post })
      .eq('id', id)
      .then((x) => {
        console.log(x);
      });
  }
}
