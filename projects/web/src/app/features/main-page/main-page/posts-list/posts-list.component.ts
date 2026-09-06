import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Post, Tag } from '@shared/core/supabase';
import { BasicPostCardComponent } from './post-card/basic-post-card/basic-post-card.component';
import { PostsStore } from '../../posts.store';
import { TagsStore } from '../../tags.store';
import { AboutMeComponent } from './about-me/about-me.component';
import { TagsScrollComponent } from './tags-scroll/tags-scroll.component';
import { FirstPostCardComponent } from './post-card/first-post-card/first-post-card.component';

@Component({
  selector: 'web-posts-list',
  standalone: true,
  imports: [
    RouterModule,
    AboutMeComponent,
    BasicPostCardComponent,
    TagsScrollComponent,
    FirstPostCardComponent,
  ],
  templateUrl: './posts-list.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PostsListComponent {
  postStore = inject(PostsStore);
  tagsStore = inject(TagsStore);
  readonly posts: Signal<Post[]> = this.postStore.posts;
  readonly tags: Signal<Tag[]> = this.tagsStore.tags;
}
