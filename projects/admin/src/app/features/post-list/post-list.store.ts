import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { PostListItem, PostListService } from './post-list.service';

interface PostListState {
  postList: PostListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PostListState = {
  postList: [],
  loading: false,
  error: null,
};

export const PostListStore = signalStore(
  withState(initialState),

  withProps(() => ({
    _postListService: inject(PostListService),
  })),
  withMethods(store => ({
    getAllPosts: async () => {
      try {
        patchState(store, { loading: true, error: null });
        const posts = await store._postListService.getAllPosts();
        patchState(store, { postList: posts, loading: false, error: null });
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw error;
      }
    },
  })),
  withHooks({
    onInit: async store => {
      await store.getAllPosts();
    },
  })
);
