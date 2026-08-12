import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '@shared/core/supabase';
import { ChipComponent } from '@shared/ui/chip';
import { IconComponent } from '@shared/pattern/icon-system';

@Component({
  selector: 'web-first-post-card',
  imports: [ChipComponent, DatePipe, IconComponent, NgOptimizedImage, RouterLink],
  templateUrl: './first-post-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstPostCardComponent {
  readonly post = input.required<Post>();
}
