import { afterNextRender, DestroyRef, Directive, inject } from '@angular/core';
import { PostStore } from '../post.store';

@Directive({
  selector: '[webObserveActiveHeading]',
  standalone: true,
})
export class ObserveActiveHeadingDirective {
  private readonly postStore = inject(PostStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender({ read: () => this.observeHeadings() });
  }

  private observeHeadings(): void {
    for (const item of this.postStore.tableOfContents()) {
      const heading = document.getElementById(item.id);
      if (!heading) {
        continue;
      }

      const scrollOffset = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.postStore.setActiveHeading(item.id);
          }
        },
        { rootMargin: `-${scrollOffset}px 0px -70% 0px`, threshold: 0 }
      );

      observer.observe(heading);
      this.destroyRef.onDestroy(() => observer.disconnect());
    }
  }
}
