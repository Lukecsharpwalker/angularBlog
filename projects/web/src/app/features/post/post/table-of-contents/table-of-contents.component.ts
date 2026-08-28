import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { TableOfContentsElement } from '@shared/core/toc';

@Component({
  selector: 'web-table-of-contents',
  standalone: true,
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent {
  readonly items = input.required<TableOfContentsElement[]>();

  protected readonly activeId = linkedSignal<string>(() => this.items()[0].id);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender({ read: () => this.observeHeadings() });
  }

  protected scrollToSection(sectionId: string): void {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private observeHeadings(): void {
    for (const item of this.items()) {
      const heading = document.getElementById(item.id);
      if (!heading) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.activeId.set(item.id);
          }
        },
        { rootMargin: '0% 0% -92% 0%', threshold: 0 }
      );

      observer.observe(heading);
      this.destroyRef.onDestroy(() => observer.disconnect());
    }
  }
}
