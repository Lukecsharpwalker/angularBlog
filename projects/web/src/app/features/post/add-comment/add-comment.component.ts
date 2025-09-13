import { ChangeDetectionStrategy, Component, inject, input, signal, Signal } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ReaderApiService } from '../../../core/blog/reader-api.service';
import { CommentsStore } from '../comments.store';
import { Comment } from '@shared/core/supabase';

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
  readonly postId = input.required<string>();

  commentForm: FormGroup = new FormGroup({
    content: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    }),
  });

  readonly isSubmitting: Signal<boolean>;

  private readonly _isSubmitting = signal(false);
  private commentsStore = inject(CommentsStore);

  constructor() {
    this.isSubmitting = this._isSubmitting.asReadonly();
  }

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
