import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentForm } from './add-comment.models';
import { ProfileStore } from '../../../../core';
import { CommentsStore } from '../comments/comments.store';

@Component({
  selector: 'web-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentComponent {
  readonly postId = input.required<string>();

  protected readonly commentsStore = inject(CommentsStore);
  protected readonly isSubmitting = this.commentsStore.submitting;

  protected commentForm = new FormGroup<CommentForm>({
    content: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    }),
  });

  private readonly userId = inject(ProfileStore).userId;

  protected async onSubmit(): Promise<void> {
    const userId = this.userId();

    if (this.commentForm.invalid || !userId || this.isSubmitting()) {
      return;
    }
    //Refactor to return status, not just True
    const commentAdded = await this.commentsStore.addComment({
      content: this.commentForm.controls.content.value,
      user_id: userId,
      post_id: this.postId(),
    });

    if (commentAdded) {
      this.commentForm.reset();
    }
  }
}
