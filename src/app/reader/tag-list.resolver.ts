import { ResolveFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { TagsStore } from '../shared/stores/tags.store';
import { isPlatformServer } from '@angular/common';

export const tagListResolver: ResolveFn<boolean> = async () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformServer(platformId)) {
    return true;
  }
  const tagStore = inject(TagsStore);
  await tagStore.getTags();
  return true;
};
