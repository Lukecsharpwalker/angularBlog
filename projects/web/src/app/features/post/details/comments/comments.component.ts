import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ReaderApiService } from '../../../../core/services/reader-api.service';
import { CommentsStore } from './comments.store';
import { HasRoleDirective } from 'shared';
import { Comment } from 'shared';

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
  public readonly comments = input<Comment[]>();
  public readonly postId = input.required<string>();

  private commentsStore = inject(CommentsStore);

  deleteComment(commentId: string): void {
    this.commentsStore.deleteComment(commentId, this.postId());
  }
}
