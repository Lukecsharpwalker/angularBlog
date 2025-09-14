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
import { TagsScrollService } from './tags-scroll.service';
import { Tag } from '@shared/core/supabase';

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
    return [
      activeIndex === 0 ? 'bg-secondary/70' : 'bg-tertiary/30',
      activeIndex === 1 ? 'bg-secondary/70' : 'bg-tertiary/30',
      activeIndex === 2 ? 'bg-secondary/70' : 'bg-tertiary/30',
    ];
  });

  protected readonly scrollService = inject(TagsScrollService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.scrollService.initializeScrolling(this.scroll, this.destroyRef);
    });
  }

  protected scrollBy(direction: 'left' | 'right'): void {
    const container = this.scroll()?.nativeElement;
    if (container) {
      const scrollAmount = direction === 'left' ? -135 : 135;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

}
