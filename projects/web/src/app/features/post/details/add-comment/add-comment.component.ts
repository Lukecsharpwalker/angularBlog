import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
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
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    }),
  });

  private commentsStore = inject(CommentsStore);
  private _isSubmitting = signal(false);

  readonly isSubmitting = this._isSubmitting.asReadonly();

  async onSubmit(): Promise<void> {
    if (this.commentForm.valid && !this._isSubmitting()) {
      this._isSubmitting.set(true);
      
      try {
        const comment: Comment = {
          ...this.commentForm.value,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          is_deleted: false,
          is_reported: false,
          post_id: this.postId(),
          user_id: null, // In a real app, this would be the current user's ID
        };
        
        await this.commentsStore.addComment(this.postId(), comment);
        this.commentForm.reset();
        
        // Add a small delay for UX smoothness
        setTimeout(() => {
          this._isSubmitting.set(false);
        }, 500);
      } catch (error) {
        this._isSubmitting.set(false);
        console.error('Error adding comment:', error);
      }
    }
  }
}
