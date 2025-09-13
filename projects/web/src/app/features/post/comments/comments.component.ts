import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ReaderApiService } from '../../../core/blog/reader-api.service';
import { CommentsStore } from '../comments.store';
import { HasRoleDirective } from '../../../core/auth/has-role.directive';
import { Comment } from '@shared/core/supabase';

@Component({
  selector: 'web-comments',
  standalone: true,
  providers: [ReaderApiService, CommentsStore],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HasRoleDirective],
})
export class CommentsComponent {
  readonly comments = input<Comment[]>();
  readonly postId = input.required<string>();

  private commentsStore = inject(CommentsStore);

  deleteComment(commentId: string): void {
    this.commentsStore.deleteComment(commentId, this.postId());
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${diffInYears}y ago`;
  }
}
