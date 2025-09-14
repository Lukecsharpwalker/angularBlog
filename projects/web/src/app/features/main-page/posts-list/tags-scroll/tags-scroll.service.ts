import {
  Injectable,
  ElementRef,
  DestroyRef,
  signal,
  computed,
} from '@angular/core';

@Injectable()
export class TagsScrollService {
  readonly scrollProgress = signal(0);

  readonly activeDotIndex = computed(() => {
    const progress = this.scrollProgress();
    if (progress < 33) return 0;
    if (progress < 66) return 1;
    return 2;
  });

  initializeScrolling(
    scrollContainer: () => ElementRef<HTMLElement> | undefined,
    destroyRef: DestroyRef
  ): void {
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
