import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
  ElementRef,
  DestroyRef,
  input,
  computed,
  afterNextRender,
  Signal,
} from '@angular/core';
import { Tag } from '@shared/core/supabase';
import { TagsScrollService } from './tags-scroll.service';

const SCROLL_AMOUNT = 135;
const PROGRESS_THRESHOLDS = [33, 66];

@Component({
  selector: 'web-tags-scroll',
  imports: [NgOptimizedImage],
  providers: [TagsScrollService],
  templateUrl: './tags-scroll.component.html',
  styleUrl: './tags-scroll.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsScrollComponent {
  readonly scroll = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  readonly tags = input.required<Tag[] | null>();
  readonly activeDotClasses: Signal<string[]> = computed(() => {
    const activeIndex = this.scrollService.activeDotIndex();
    const dotCount = PROGRESS_THRESHOLDS.length + 1;

    return Array.from({ length: dotCount }, (_, i) =>
      i === activeIndex ? 'bg-secondary/70' : 'bg-tertiary/30'
    );
  });

  protected readonly scrollService = inject(TagsScrollService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.scrollService.initializeScrolling(this.scroll, this.destroyRef, PROGRESS_THRESHOLDS);
    });
  }

  protected scrollBy(direction: 'left' | 'right'): void {
    const container = this.scroll()?.nativeElement;
    if (container) {
      const scrollAmount = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

}
