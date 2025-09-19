import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Comment } from '@shared/core/supabase';
import { ReaderApiService } from '../../../../core';
import { CommentsStore } from '../comments.store';

@Component({
  selector: 'web-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [ReaderApiService, CommentsStore],
  templateUrl: './add-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentComponent {
  readonly postId = input.required<string>();

  protected commentForm: FormGroup = new FormGroup({
    content: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    }),
  });

  protected readonly isSubmitting: WritableSignal<boolean> = signal(false);

  private commentsStore = inject(CommentsStore);

  async onSubmit(): Promise<void> {
    if (this.commentForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      try {
        const comment: Comment = {
          ...this.commentForm.value,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          is_deleted: false,
          is_reported: false,
          post_id: this.postId(),
          user_id: null,
        };

        await this.commentsStore.addComment(this.postId(), comment);
        this.commentForm.reset();

        setTimeout(() => {
          this.isSubmitting.set(false);
        }, 500);
      } catch (error) {
        this.isSubmitting.set(false);
        console.error('Error adding comment:', error);
      }
    }
  }
}
