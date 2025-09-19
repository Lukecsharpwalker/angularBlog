import { Injectable, ElementRef, DestroyRef, signal, computed } from '@angular/core';

@Injectable()
export class TagsScrollService {
  readonly scrollProgress = signal(0);

  readonly activeDotIndex = computed(() => {
    const progress = this.scrollProgress();
    const thresholds = this.progressThresholds();

    for (let i = 0; i < thresholds.length; i++) {
      if (progress < thresholds[i]) {
        return i;
      }
    }
    return thresholds.length;
  });

  private readonly progressThresholds = signal<number[]>([33, 66]);

  initializeScrolling(
    scrollContainer: () => ElementRef<HTMLElement> | undefined,
    destroyRef: DestroyRef,
    thresholds?: number[]
  ): void {
    if (thresholds) {
      this.progressThresholds.set(thresholds);
    }
    this.scrollProgress.set(0);

    const scrollHandler = this.createScrollHandler();
    const element = scrollContainer()?.nativeElement;

    if (element) {
      element.addEventListener('scroll', scrollHandler, { passive: true });

      destroyRef.onDestroy(() => {
        element.removeEventListener('scroll', scrollHandler);
      });
    }
  }

  private createScrollHandler(): (event: Event) => void {
    return (event: Event) => {
      const target = event.target as HTMLElement;
      const { scrollLeft, scrollWidth, clientWidth } = target;

      const maxScroll = scrollWidth - clientWidth;
      const scrollPercentage = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

      this.scrollProgress.set(Math.max(0, Math.min(100, scrollPercentage)));
    };
  }
}
