import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableOfContents } from '@shared/core/blog';

@Component({
  selector: 'web-table-of-contents',
  standalone: true,
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent {
  readonly items = input.required<TableOfContents[]>();
}
