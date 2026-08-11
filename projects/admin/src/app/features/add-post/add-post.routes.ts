import { Routes } from '@angular/router';
import { AddPostComponent } from './add-post.component';
import { AddPostStore } from './add-post.store';
import { AddPostService } from './add-post.service';
import { PostFormService } from './post-form.service';
import { ADMIN_PATH } from '../../core/routing/admin-routes';

export default [
  {
    path: '',
    providers: [AddPostStore, AddPostService, PostFormService],
    children: [
      {
        path: '',
        redirectTo: ADMIN_PATH.newPost,
        pathMatch: 'full',
      },
      {
        path: ADMIN_PATH.newPost,
        component: AddPostComponent,
      },
      {
        path: ':postId',
        component: AddPostComponent,
      },
    ],
  },
] as Routes;
