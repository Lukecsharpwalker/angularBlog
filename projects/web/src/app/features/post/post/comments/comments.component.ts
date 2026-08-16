import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AvatarComponent } from '@shared/ui/avatar';
import { Roles } from '@shared/core/auth';
import { HasRoleDirective } from '../../../../core';
import { CommentsStore } from './comments.store';

@Component({
  selector: 'web-comments',
  standalone: true,
  templateUrl: './comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, DatePipe, HasRoleDirective],
})
export class CommentsComponent {
  readonly postId = input.required<string>();

  protected readonly Roles = Roles;
  protected readonly commentsStore = inject(CommentsStore);
  protected readonly comments = this.commentsStore.entities;

  protected deleteComment(commentId: string): void {
    this.commentsStore.deleteComment({ commentId, postId: this.postId() });
  }
}
