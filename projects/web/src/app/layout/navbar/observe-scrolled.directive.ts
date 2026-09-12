import { afterNextRender, DestroyRef, Directive, inject, signal } from '@angular/core';

@Directive({
  selector: '[webObserveScrolled]',
  standalone: true,
  host: {
    '[class.scrolled]': 'scrolled()',
  },
})
export class ObserveScrolledDirective {
  protected readonly scrolled = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender({ read: () => this.observeScrolling() });
  }

  private observeScrolling(): void {
    const controller = new AbortController();
    const update = () => {
      //Fix for dynamic dialog scroll blocking, it blocks the scroll but set top to 0,
      //At 0 navbar is a pill so animation to the pill is triggered
      if (document.documentElement.classList.contains('page-scroll-blocked')) {
        return;
      }
      this.scrolled.set(window.scrollY > 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true, signal: controller.signal });
    this.destroyRef.onDestroy(() => controller.abort());
  }
}
