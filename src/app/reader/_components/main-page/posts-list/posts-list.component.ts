import { DatePipe, NgOptimizedImage, NgStyle } from '@angular/common';
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
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutMeComponent } from '../../../../shared/about-me/about-me.component';
import { PostCardComponent } from './post-card/post-card.component';
import { PostsStore } from './posts.store';
import { TagsStore } from '../../../../shared/stores/tags.store';
import { Post } from '../../../../types/supabase';
import { ReaderApiService } from '../../../_services/reader-api.service';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    RouterModule,
    AboutMeComponent,
    PostCardComponent,
    NgOptimizedImage,
    NgStyle,
  ],
  providers: [DatePipe],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostsListComponent implements OnInit {
  scroll = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  postStore = inject(PostsStore);
  tagsStore = inject(TagsStore);
  cdr = inject(ChangeDetectorRef);

  scrollProgress: WritableSignal<number> = signal(0);
  posts = this.postStore.posts;
  tags = this.tagsStore.tags;
  initialTagScrollProgressBarForMobile = 2;
  posts2: Post[] | null = null;
  postService = inject(ReaderApiService);

  constructor() {
    this.initializeScrollingForMobileView();
  }

  ngOnInit() {
    //TODO: FIX HACK FOR PRERENDERING
    this.applyPrerenderingHack();
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;

    const scrollPercentage = (scrollLeft / (scrollWidth - clientWidth)) * 100;

    this.scrollProgress.set(scrollPercentage);
  }

  private applyPrerenderingHack(): void {
    setTimeout(() => {
      this.postService.getPosts().then((posts) => {
        this.posts2 = posts;
        this.cdr.detectChanges();
      });
      console.log(this.posts());
    }, 1000);
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
