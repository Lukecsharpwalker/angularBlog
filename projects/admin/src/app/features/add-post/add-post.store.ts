import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Post, PostInsert, PostUpdate, Tag } from 'shared';
import { AddPostService } from './add-post.service';

interface AddPostState {
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  tags: Tag[];
}

const initialState: AddPostState = {
  currentPost: null,
  loading: false,
  error: null,
  submitting: false,
  tags: [],
};

export const AddPostStore = signalStore(
  withState(initialState),
  withComputed(store => ({
    availableTags: () => store.tags(),
    currentPostTags: () => store.currentPost()?.tags || [],
  })),
  withMethods((store, addPostService = inject(AddPostService)) => ({
    async loadPost(id: string) {
      patchState(store, { loading: true, error: null });
      try {
        const post = await addPostService.getPostById(id);
        patchState(store, { currentPost: post, loading: false });
      } catch (error) {
        patchState(store, {
          error: typeof error === 'string' ? error : 'Failed to load post',
          loading: false,
        });
      }
    },

    async addPost(post: PostInsert & { tags?: Tag[] }) {
      patchState(store, { submitting: true, error: null });
      try {
        await addPostService.addPost(post);
        patchState(store, { submitting: false });
      } catch (error) {
        patchState(store, {
          error: typeof error === 'string' ? error : 'Failed to create post',
          submitting: false,
        });
      }
    },

    async updatePost(id: string, post: PostUpdate & { tags?: Tag[] }) {
      patchState(store, { submitting: true, error: null });
      try {
        await addPostService.updatePost(id, post);
        patchState(store, { submitting: false });
      } catch (error) {
        patchState(store, {
          error: typeof error === 'string' ? error : 'Failed to update post',
          submitting: false,
        });
      }
    },

    async loadTags() {
      try {
        const tags = await addPostService.getTags();
        patchState(store, { tags });
      } catch (error) {
        patchState(store, {
          error: typeof error === 'string' ? error : 'Failed to load tags',
        });
      }
    },

    clearError: () => patchState(store, { error: null }),
  })),
  withHooks({
    async onInit(store) {
      await store.loadTags();
    },
  })
);
