import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'web-post-tag',
  templateUrl: './post-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostTagComponent {
  readonly text = input.required<string>();
  readonly color = input.required<string>();
}
