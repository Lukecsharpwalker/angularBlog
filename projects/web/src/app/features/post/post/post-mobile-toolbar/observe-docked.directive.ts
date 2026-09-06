import { afterNextRender, DestroyRef, Directive, ElementRef, inject, signal } from '@angular/core';

@Directive({
  selector: '[webObserveDocked]',
  standalone: true,
  host: {
    '[class.docked]': 'docked()',
  },
})
export class ObserveDockedDirective {
  protected readonly docked = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender({ read: () => this.observeDocking() });
  }

  private observeDocking(): void {
    const observer = new IntersectionObserver(
      ([entry]) => this.docked.set(entry.intersectionRatio < 1),
      { rootMargin: '-24px 0px 0px 0px', threshold: [1] }
    );

    observer.observe(this.element.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
