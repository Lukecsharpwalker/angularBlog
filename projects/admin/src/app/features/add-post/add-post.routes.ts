import { Routes } from '@angular/router';
import { AddPostComponent } from './add-post.component';
import { AddPostStore } from './add-post.store';
import { AddPostService } from './add-post.service';
import { PostFormService } from './post-form.service';

export default [
  {
    path: '',
    component: AddPostComponent,
    canDeactivate: [],
    providers: [AddPostStore, AddPostService, PostFormService],
  },
  {
    path: ':postId',
    component: AddPostComponent,
    canDeactivate: [],
    providers: [AddPostStore, AddPostService, PostFormService],
  },
] as Routes;
