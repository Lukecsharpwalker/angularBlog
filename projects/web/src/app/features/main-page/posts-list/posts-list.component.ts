import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from './post-card/post-card.component';
import { PostsStore } from '../posts.store';
import { TagsStore } from '../tags.store';
import { AboutMeComponent } from './about-me/about-me.component';
import { TagsScrollComponent } from './tags-scroll/tags-scroll.component';

@Component({
  selector: 'web-posts-list',
  standalone: true,
  imports: [RouterModule, AboutMeComponent, PostCardComponent, TagsScrollComponent],
  templateUrl: './posts-list.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PostsListComponent {
  postStore = inject(PostsStore);
  tagsStore = inject(TagsStore);
  readonly posts: Signal<Post[] | null> = this.postStore.posts;
  tags = this.tagsStore.tags;
}
