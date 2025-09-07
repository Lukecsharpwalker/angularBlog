import { NgOptimizedImage, NgStyle, NgClass } from '@angular/common';
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
  DestroyRef,
  computed,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from '../../../ui/components/post-card/post-card.component';
import { PostsStore } from './posts.store';
import { TagsStore } from './tags.store';
import { AboutMeComponent } from './about-me/about-me.component';

@Component({
  selector: 'web-posts-list',
  standalone: true,
  imports: [RouterModule, AboutMeComponent, PostCardComponent, NgOptimizedImage, NgStyle, NgClass],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostsListComponent {
  readonly scroll = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  private destroyRef = inject(DestroyRef);

  postStore = inject(PostsStore);
  tagsStore = inject(TagsStore);

  readonly scrollProgress: WritableSignal<number> = signal(0);
  readonly activeDotIndex = computed(() => {
    const progress = this.scrollProgress();
    if (progress < 33) return 0;
    if (progress < 66) return 1;
    return 2;
  });

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
    this.scrollProgress.set(0);
    afterNextRender(() => {
      const scrollHandler = this.onScroll.bind(this);
      const element = this.scroll()?.nativeElement;

      if (element) {
        element.addEventListener('scroll', scrollHandler);

        this.destroyRef.onDestroy(() => {
          element.removeEventListener('scroll', scrollHandler);
        });
      }
    });
  }
}
