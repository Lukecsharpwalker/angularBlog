import { makeStateKey, StateKey } from '@angular/core';
import { Comment, Post, PostTag, Profile, Tag } from '@shared/core/supabase';
import { UserWithRole } from '@shared/core/auth/user.model';

export const TRANSFER_STATE_KEYS = {
  APP_USER: makeStateKey<UserWithRole | null>('app-user'),
  POSTS: makeStateKey<Post[]>('posts'),
  TAGS: makeStateKey<Tag[] | null>('tags'),
  PROFILES: makeStateKey<Profile[] | null>('profiles'),
} as const;

export const createPostKey = (id: string): StateKey<Post | null> =>
  makeStateKey<Post | null>(`post-${id}`);

export const createCommentsKey = (postId: string): StateKey<Comment[]> =>
  makeStateKey<Comment[]>(`comments-${postId}`);

export const createProfileKey = (userId: string): StateKey<Profile | null> =>
  makeStateKey<Profile | null>(`profile-${userId}`);

export const createPostTagsKey = (postId: string): StateKey<PostTag[] | null> =>
  makeStateKey<PostTag[] | null>(`post-tags-${postId}`);
