import { NgOptimizedImage, NgStyle } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
  afterNextRender,
  ElementRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from '../../../ui/components/post-card/post-card.component';
import { PostsStore } from './posts.store';
import { TagsStore } from 'shared';
import { AboutMeComponent } from '../../../ui/components/about-me/about-me.component';

@Component({
  selector: 'web-posts-list',
  standalone: true,
  imports: [
    RouterModule,
    AboutMeComponent,
    PostCardComponent,
    NgOptimizedImage,
    NgStyle,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostsListComponent {
  scroll = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  postStore = inject(PostsStore);
  tagsStore = inject(TagsStore);

  scrollProgress: WritableSignal<number> = signal(0);
  posts = this.postStore.posts;
  tags = this.tagsStore.tags;
  initialTagScrollProgressBarForMobile = 2;

  constructor() {
    this.initializeScrollingForMobileView();
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;

    const scrollPercentage = (scrollLeft / (scrollWidth - clientWidth)) * 100;

    this.scrollProgress.set(scrollPercentage);
  }

  private initializeScrollingForMobileView(): void {
    this.scrollProgress.set(this.initialTagScrollProgressBarForMobile);
    afterNextRender(() => {
      this.scroll()?.nativeElement.addEventListener(
        'scroll',
        this.onScroll.bind(this),
      );
    });
  }
}
