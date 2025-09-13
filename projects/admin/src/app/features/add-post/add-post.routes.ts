import { Routes } from '@angular/router';
import { AddPostComponent } from './add-post.component';
import { AddPostStore } from './add-post.store';
import { AddPostService } from './add-post.service';

export default [
  {
    path: '',
    component: AddPostComponent,
    canDeactivate: [],
    providers: [AddPostStore, AddPostService],
  },
  {
    path: ':postId',
    component: AddPostComponent,
    canDeactivate: [],
    providers: [AddPostStore, AddPostService],
  },
] as Routes;
