import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { Post } from '../../supabase-types';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class AdminApiService {
  http = inject(HttpClient);
  supabaseService = inject(SupabaseService);
  private readonly baseUrl =
    'https://aqdbdmepncxxuanlymwr.supabase.co/rest/v1/';
  private readonly apiKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZGJkbWVwbmN4eHVhbmx5bXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTA0MjYsImV4cCI6MjA2MDYyNjQyNn0.RNtZZ4Of4LIP3XuS9lumHYdjRLVUGXARtAxaTJmF7lc';

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
