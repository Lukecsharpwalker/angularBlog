import { inject, InjectionToken } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { PostTag } from '../../models';

// Abstract interface for post tags API service
export interface PostTagsApiService {
  getPostTags(postId: string): Promise<PostTag[] | null>;
}

// Injection token for the post tags API service
export const POST_TAGS_API_SERVICE = new InjectionToken<PostTagsApiService>('PostTagsApiService');

type PostTagsState = {
  postTags: PostTag[];
  loading: boolean;
  error: string | null;
};

const initialState: PostTagsState = {
  postTags: [],
  loading: false,
  error: null,
};

export const PostTagsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((state, postTagsService = inject(POST_TAGS_API_SERVICE)) => ({
    async getPostTags(postId: string) {
      patchState(state, { loading: true, error: null });
      try {
        const postTags = await postTagsService.getPostTags(postId);
        if (postTags) {
          patchState(state, { postTags, loading: false });
        } else {
          patchState(state, { postTags: [], error: 'No post tags found', loading: false });
        }
      } catch (error) {
        patchState(state, {
          error: 'Failed to fetch post tags',
          loading: false,
        });
      }
    },
  })),
);