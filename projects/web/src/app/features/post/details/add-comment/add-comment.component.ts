import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ReaderApiService } from '../../../../core/services/reader-api.service';
import { CommentsStore } from '../comments/comments.store';
import { Comment } from 'shared';

@Component({
  selector: 'web-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [ReaderApiService, CommentsStore],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentComponent {
  public readonly postId = input.required<string>();

  commentForm: FormGroup = new FormGroup({
    content: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  private commentsStore = inject(CommentsStore);

  onSubmit(): void {
    if (this.commentForm.valid) {
      const comment: Comment = {
        ...this.commentForm.value,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_deleted: false,
        is_reported: false,
        post_id: this.postId(),
        user_id: null, // In a real app, this would be the current user's ID
      };
      this.commentsStore.addComment(this.postId(), comment);
      this.commentForm.reset();
    }
  }
}
