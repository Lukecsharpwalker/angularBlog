import { Routes } from '@angular/router';
import { AddPostComponent } from './add-post.component';
import { AddPostService } from './add-post.service';
import { ADMIN_PATH } from '../../core/routing/admin-routes';

export default [
  {
    path: '',
    providers: [AddPostService],
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
