import { Routes } from '@angular/router';
import { AddPostComponent } from './add-post.component';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export default [
  {
    path: '',
    component: AddPostComponent,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':postId',
    component: AddPostComponent,
    canDeactivate: [unsavedChangesGuard],
  },
] as Routes;
