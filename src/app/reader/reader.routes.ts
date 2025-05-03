import { Routes } from '@angular/router';
import { MainPageComponent } from './_components/main-page/main-page.component';
import { PostComponent } from './_components/main-page/post/post.component';
import { PostsListComponent } from './_components/main-page/posts-list/posts-list.component';
import { postListResolver } from './post-list.resolver';
import { tagListResolver } from './tag-list.resolver';

export const readerRoutes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        component: PostsListComponent,
        // resolve: [postListResolver, tagListResolver],
      },
      {
        path: 'details/:id',
        component: PostComponent,
        pathMatch: 'full',
      },
    ],
  },
];
