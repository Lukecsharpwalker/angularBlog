import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '@shared/core/supabase';
import { ChipComponent } from '@shared/ui/chip';
import { PostCardBodyComponent } from '../post-card-body/post-card-body.component';

@Component({
  selector: 'web-first-post-card',
  imports: [ChipComponent, NgOptimizedImage, PostCardBodyComponent, RouterLink],
  templateUrl: './first-post-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstPostCardComponent {
  readonly post = input.required<Post>();
}
