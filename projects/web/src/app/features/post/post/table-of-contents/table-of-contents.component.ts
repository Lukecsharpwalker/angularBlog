import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { PostStore } from '../../post.store';

@Component({
  selector: 'web-table-of-contents',
  standalone: true,
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TableOfContentsComponent {
  readonly selectAction = input<'scroll' | 'emit'>('scroll');
  readonly sectionSelected = output<string>();

  protected readonly items = inject(PostStore).tableOfContents;
  protected readonly activeId = inject(PostStore).activeHeading;

  protected scrollToSection(sectionId: string): void {
    const sectionElement = document.getElementById(sectionId);
    if (this.selectAction() === 'scroll') {
      sectionElement?.scrollIntoView({ behavior: 'smooth' });
    }
    // Emit the sectionId and dialog will handle scroll
    if (this.selectAction() === 'emit') {
      this.sectionSelected.emit(sectionId);
    }
  }
}
