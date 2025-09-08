import { NgOptimizedImage, NgStyle, NgClass } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from '../../../../ui/components/post-card/post-card.component';
import { PostsStore } from '../../stores/posts.store';
import { TagsStore } from '../../stores/tags.store';
import { AboutMeComponent } from './about-me/about-me.component';
import { PostsListService } from '../../services/posts-list.service';

@Component({
  selector: 'web-posts-list',
  standalone: true,
  imports: [RouterModule, AboutMeComponent, PostCardComponent, NgOptimizedImage, NgStyle, NgClass],
  providers: [PostsListService],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostsListComponent {
  readonly scroll = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  postStore = inject(PostsStore);
  tagsStore = inject(TagsStore);
  posts = this.postStore.posts;
  tags = this.tagsStore.tags;
  initialTagScrollProgressBarForMobile = 2;

  private destroyRef = inject(DestroyRef);
  private postsListService = inject(PostsListService);

  constructor() {
    this.postsListService.initializeScrolling(this.scroll, this.destroyRef);
  }

  get scrollProgress() {
    return this.postsListService.scrollProgress;
  }

  get activeDotIndex() {
    return this.postsListService.activeDotIndex;
  }
}
