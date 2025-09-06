import { Routes } from '@angular/router';
import { AddPostComponent } from './add-post.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { AddPostStore } from './add-post.store';
import { AddPostService } from './add-post.service';

export default [
  {
    path: '',
    component: AddPostComponent,
    canDeactivate: [unsavedChangesGuard],
    providers: [AddPostStore, AddPostService],
  },
  {
    path: ':postId',
    component: AddPostComponent,
    canDeactivate: [unsavedChangesGuard],
    providers: [AddPostStore, AddPostService],
  },
] as Routes;
