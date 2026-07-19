import { inject, Injectable, PLATFORM_ID, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { pendingUntilEvent } from '@angular/core/rxjs-interop';
import { from, map, Observable, of, tap } from 'rxjs';
import { Comment, Post, PostTag, Profile, SUPABASE_CLIENT, Tag } from '@shared/core/supabase';
import {
  createCommentsKey,
  createPostKey,
  createPostTagsKey,
  createProfileKey,
  TRANSFER_STATE_KEYS,
} from '../utils';

@Injectable({ providedIn: 'root' })
export class ReaderApiService {
  private readonly client = inject(SUPABASE_CLIENT);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  getPost(id: string): Observable<Post | null> {
    const POST_KEY = createPostKey(id);

    if (isPlatformServer(this.platformId)) {
      return from(
        this.client
          .from('posts')
          .select(
            '*, author:profiles(id,username,avatar_url), post_tags!inner(tags(id,name,color,icon)), comments(id,content,created_at,is_deleted,is_reported,author:profiles(id,username,avatar_url))'
          )
          .eq('id', id)
          .single()
      ).pipe(
        map(x => (x.error ? null : x.data)),
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
      this.client
        .from('posts')
        .select(
          '*, author:profiles(id,username,avatar_url), post_tags!inner(tags(id,name,color,icon)), comments(id,content,created_at,is_deleted,is_reported,author:profiles(id,username,avatar_url))'
        )
        .eq('id', id)
        .single()
    ).pipe(
      map(x => (x.error ? null : x.data)),
      pendingUntilEvent()
    );
  }

  getComments(postId: string): Observable<Comment[]> {
    const COMMENTS_KEY = createCommentsKey(postId);

    if (isPlatformServer(this.platformId)) {
      return from(
        this.client.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
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
      this.client.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    ).pipe(
      map(x => (x.error ? [] : x.data)),
      pendingUntilEvent()
    );
  }

  addComment(postId: string, comment: Comment): Observable<void> {
    return from(this.client.from('comments').insert({ ...comment, post_id: postId })).pipe(
      map(() => void 0),
      pendingUntilEvent()
    );
  }

  deleteComment(commentId: string, postId: string): Observable<void> {
    return from(this.client.from('comments').delete().eq('id', commentId).eq('post_id', postId)).pipe(
      map(() => void 0),
      pendingUntilEvent()
    );
  }

  getPosts(): Observable<Post[]> {
    if (isPlatformServer(this.platformId)) {
      return from(
        this.client
          .from('posts')
          .select('*, author:profiles(id,username,avatar_url), post_tags(tags(id,name,color,icon))')
          .eq('is_draft', false)
          .order('created_at', { ascending: false })
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
      this.client
        .from('posts')
        .select('*, author:profiles(id,username,avatar_url), post_tags(tags(id,name,color,icon))')
        .eq('is_draft', false)
        .order('created_at', { ascending: false })
    ).pipe(
      map(x => (x.error ? [] : x.data)),
      pendingUntilEvent()
    );
  }

  getProfiles(): Observable<Profile[] | null> {
    if (isPlatformServer(this.platformId)) {
      return from(this.client.from('profiles').select('*')).pipe(
        map(x => (x.error ? null : x.data)),
        tap(profiles => {
          this.transferState.set(TRANSFER_STATE_KEYS.PROFILES, profiles);
        }),
        pendingUntilEvent()
      );
    }

    if (this.transferState.hasKey(TRANSFER_STATE_KEYS.PROFILES)) {
      const profiles = this.transferState.get(TRANSFER_STATE_KEYS.PROFILES, null);
      this.transferState.remove(TRANSFER_STATE_KEYS.PROFILES);
      return of(profiles);
    }

    return from(this.client.from('profiles').select('*')).pipe(
      map(x => (x.error ? null : x.data)),
      pendingUntilEvent()
    );
  }

  getProfileById(userId: string): Observable<Profile | null> {
    const PROFILE_KEY = createProfileKey(userId);

    if (isPlatformServer(this.platformId)) {
      return from(this.client.from('profiles').select('*').eq('id', userId).single()).pipe(
        map(x => (x.error ? null : x.data)),
        tap(profile => {
          this.transferState.set(PROFILE_KEY, profile);
        }),
        pendingUntilEvent()
      );
    }

    if (this.transferState.hasKey(PROFILE_KEY)) {
      const profile = this.transferState.get(PROFILE_KEY, null);
      this.transferState.remove(PROFILE_KEY);
      return of(profile);
    }

    return from(this.client.from('profiles').select('*').eq('id', userId).single()).pipe(
      map(x => (x.error ? null : x.data)),
      pendingUntilEvent()
    );
  }

  getTags(): Observable<Tag[] | null> {
    if (isPlatformServer(this.platformId)) {
      return from(this.client.from('tags').select('*')).pipe(
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

    return from(this.client.from('tags').select('*')).pipe(
      map(x => (x.error ? null : x.data)),
      pendingUntilEvent()
    );
  }

  getPostTags(postId: string): Observable<PostTag[] | null> {
    const POST_TAGS_KEY = createPostTagsKey(postId);

    if (isPlatformServer(this.platformId)) {
      return from(this.client.from('post_tags').select('*, tags(*)').eq('post_id', postId)).pipe(
        map(x => (x.error ? null : x.data)),
        tap(postTags => {
          this.transferState.set(POST_TAGS_KEY, postTags);
        }),
        pendingUntilEvent()
      );
    }

    if (this.transferState.hasKey(POST_TAGS_KEY)) {
      const postTags = this.transferState.get(POST_TAGS_KEY, null);
      this.transferState.remove(POST_TAGS_KEY);
      return of(postTags);
    }

    return from(this.client.from('post_tags').select('*, tags(*)').eq('post_id', postId)).pipe(
      map(x => (x.error ? null : x.data)),
      pendingUntilEvent()
    );
  }
}
