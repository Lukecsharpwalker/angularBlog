import { Injectable, ElementRef, DestroyRef, signal, computed, afterNextRender } from '@angular/core';

@Injectable()
export class PostsListService {
  readonly scrollProgress = signal(0);
  readonly activeDotIndex = computed(() => {
    const progress = this.scrollProgress();
    if (progress < 33) return 0;
    if (progress < 66) return 1;
    return 2;
  });

  initializeScrolling(scrollContainer: () => ElementRef<HTMLElement> | undefined, destroyRef: DestroyRef): void {
    this.scrollProgress.set(0);
    afterNextRender(() => {
      const scrollHandler = this.createScrollHandler();
      const element = scrollContainer()?.nativeElement;

      if (element) {
        element.addEventListener('scroll', scrollHandler);

        destroyRef.onDestroy(() => {
          element.removeEventListener('scroll', scrollHandler);
        });
      }
    });
  }

  private createScrollHandler(): (event: Event) => void {
    return (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollLeft = target.scrollLeft;
      const scrollWidth = target.scrollWidth;
      const clientWidth = target.clientWidth;

      const scrollPercentage = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      this.scrollProgress.set(scrollPercentage);
    };
  }
}