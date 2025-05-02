import { PostsStore } from './_components/main-page/posts-list/posts.store';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export const postListResolver = async () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformServer(platformId)) {
    return true;
  }
  const postStore = inject(PostsStore);
  await postStore.getPosts();
  return true;
};
