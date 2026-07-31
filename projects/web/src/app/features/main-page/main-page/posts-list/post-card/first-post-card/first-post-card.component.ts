import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Post } from '@shared/core/supabase';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'web-first-post-card',
  imports: [DatePipe, NgOptimizedImage, RouterLink],
  templateUrl: './first-post-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstPostCardComponent {
  readonly post = input.required<Post>();

  private readonly tagColors = [
    'bg-[#E7EFDD] text-[#2F5D4A]',
    'bg-[#F0E7DA] text-[#9C6A3C]',
    'bg-[#EDE6E0] text-[#6B7A4E]',
    'bg-tertiary/40 text-secondary',
  ];

  protected getTagColorClass(index: number): string {
    return this.tagColors[index % this.tagColors.length];
  }

  protected getPostImageUrl(): string {
    const createdAt = new Date(this.post().created_at!);
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}-post.webp`;
  }
}
