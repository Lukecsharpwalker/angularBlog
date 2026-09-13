import { inject, injectAsync, Injectable, PLATFORM_ID, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { pendingUntilEvent } from '@angular/core/rxjs-interop';
import { from, map, Observable, of, tap } from 'rxjs';
import { Comment, CommentInsert, Post, Tag } from '@shared/core/supabase';
import { createCommentsKey, createPostKey, TRANSFER_STATE_KEYS } from '../utils';

@Injectable({ providedIn: 'root' })
export class ReaderApiService {
  //TODO: change pendingUntilEvent to Promise equivalent | https://github.com/Lukecsharpwalker/angularBlog/issues/122
  private readonly client = injectAsync(() =>
    import('@shared/core/supabase/supabase.client').then(m => m.SUPABASE_CLIENT)
  );
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  getPost(id: string): Observable<Post | null> {
    const POST_KEY = createPostKey(id);

    if (isPlatformServer(this.platformId)) {
      return from(
        this.client().then(client =>
          client
            .from('posts')
            .select(
              '*, table_of_contents_sorted, author:profiles(id,username,avatar_url), tags!inner(id,name,color,icon)'
            )
            .eq('id', id)
            .limit(1)
            .single()
        )
      ).pipe(
        map(({ data, error }) => {
          if (error) throw error;
          return data;
        }),
        tap(post => {
          this.transferState.set(POST_KEY, post);
        }),
        pendingUntilEvent()
      );
    }

    if (this.transferState.hasKey(POST_KEY)) {
      const post = this.transferState.get(POST_KEY, null);
      this.transferState.remove(POST_KEY);
      return of(post);
    }

    return from(
      this.client().then(client =>
        client
          .from('posts')
          .select(
            '*, table_of_contents_sorted, author:profiles(id,username,avatar_url), tags!inner(id,name,color,icon)'
          )
          .eq('id', id)
          .limit(1)
          .single()
      )
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  getComments(postId: string): Observable<Comment[]> {
    const COMMENTS_KEY = createCommentsKey(postId);

    if (isPlatformServer(this.platformId)) {
      return from(
        this.client().then(client =>
          client
            .from('comments')
            .select(
              'id,content,created_at,is_deleted,is_reported,post_id,user_id,author:profiles(id,username,avatar_url)'
            )
            .eq('post_id', postId)
            .order('created_at', { ascending: true })
            .overrideTypes<Comment[], { merge: false }>()
        )
      ).pipe(
        map(x => (x.error ? [] : x.data)),
        tap(comments => {
          this.transferState.set(COMMENTS_KEY, comments);
        }),
        pendingUntilEvent()
      );
    }

    if (this.transferState.hasKey(COMMENTS_KEY)) {
      const comments = this.transferState.get(COMMENTS_KEY, []);
      this.transferState.remove(COMMENTS_KEY);
      return of(comments);
    }

    return from(
      this.client().then(client =>
        client
          .from('comments')
          .select(
            'id,content,created_at,is_deleted,is_reported,post_id,user_id,author:profiles(id,username,avatar_url)'
          )
          .eq('post_id', postId)
          .order('created_at', { ascending: true })
          .overrideTypes<Comment[], { merge: false }>()
      )
    ).pipe(map(x => (x.error ? [] : x.data)));
  }

  addComment(comment: CommentInsert): Observable<Comment> {
    return from(
      this.client().then(client =>
        client
          .from('comments')
          .insert(comment)
          .select(
            'id,content,created_at,is_deleted,is_reported,post_id,user_id,author:profiles(id,username,avatar_url)'
          )
          .single()
          .overrideTypes<Comment, { merge: false }>()
      )
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  deleteComment(commentId: string, postId: string): Observable<void> {
    return from(
      this.client().then(client =>
        client.from('comments').delete().eq('id', commentId).eq('post_id', postId)
      )
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  getPosts(): Observable<Post[]> {
    if (isPlatformServer(this.platformId)) {
      return from(
        this.client().then(client =>
          client
            .from('posts')
            .select('*, author:profiles(id,username,avatar_url), tags(id,name,color,icon)')
            .eq('is_draft', false)
            .order('created_at', { ascending: false })
        )
      ).pipe(
        map(x => (x.error ? [] : x.data)),
        tap(posts => {
          this.transferState.set(TRANSFER_STATE_KEYS.POSTS, posts);
        }),
        pendingUntilEvent()
      );
    }

    if (this.transferState.hasKey(TRANSFER_STATE_KEYS.POSTS)) {
      const posts = this.transferState.get(TRANSFER_STATE_KEYS.POSTS, []);
      this.transferState.remove(TRANSFER_STATE_KEYS.POSTS);
      return of(posts);
    }

    return from(
      this.client().then(client =>
        client
          .from('posts')
          .select('*, author:profiles(id,username,avatar_url), tags(id,name,color,icon)')
          .eq('is_draft', false)
          .order('created_at', { ascending: false })
      )
    ).pipe(map(x => (x.error ? [] : x.data)));
  }

  getTags(): Observable<Tag[] | null> {
    if (isPlatformServer(this.platformId)) {
      return from(this.client().then(client => client.from('tags').select('*'))).pipe(
        map(x => (x.error ? null : x.data)),
        tap(tags => {
          this.transferState.set(TRANSFER_STATE_KEYS.TAGS, tags);
        }),
        pendingUntilEvent()
      );
    }

    if (this.transferState.hasKey(TRANSFER_STATE_KEYS.TAGS)) {
      const tags = this.transferState.get(TRANSFER_STATE_KEYS.TAGS, null);
      this.transferState.remove(TRANSFER_STATE_KEYS.TAGS);
      return of(tags);
    }

    return from(this.client().then(client => client.from('tags').select('*'))).pipe(
      map(x => (x.error ? null : x.data))
    );
  }
}
