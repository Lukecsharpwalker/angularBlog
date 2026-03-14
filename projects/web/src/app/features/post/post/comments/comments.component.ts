import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { HasRoleDirective, ReaderApiService } from '../../../../core';
import { CommentsStore } from '../comments.store';
import { Comment } from '@shared/core/supabase';
import { Roles } from '@shared/core/auth';

@Component({
  selector: 'web-comments',
  standalone: true,
  providers: [ReaderApiService, CommentsStore],
  templateUrl: './comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HasRoleDirective],
})
export class CommentsComponent {
  readonly comments = input<Comment[] | undefined>();
  readonly postId = input.required<string>();

  protected readonly Roles = Roles

  private commentsStore = inject(CommentsStore);

  protected deleteComment(commentId: string): void {
    this.commentsStore.deleteComment(commentId, this.postId());
  }

  protected getRelativeTime(dateString: string): string {
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
