import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconComponent } from '@shared/pattern/icon-system';

@Component({
  selector: 'web-post-card-body',
  imports: [DatePipe, IconComponent],
  templateUrl: './post-card-body.component.html',
  styleUrl: './post-card-body.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-1 flex-col gap-3',
    '[attr.data-featured]': 'featured()',
  },
})
export class PostCardBodyComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string | null>();
  readonly createdAt = input.required<string | null>();
  readonly featured = input(false);
}
