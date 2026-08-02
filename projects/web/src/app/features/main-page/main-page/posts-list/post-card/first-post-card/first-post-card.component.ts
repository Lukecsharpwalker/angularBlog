import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '@shared/core/supabase';

@Component({
  selector: 'web-first-post-card',
  imports: [DatePipe, NgOptimizedImage, RouterLink],
  templateUrl: './first-post-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstPostCardComponent {
  readonly post = input.required<Post>();

  protected getPostImageUrl(): string {
    const createdAt = new Date(this.post().created_at!);
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}-post.webp`;
  }
}
