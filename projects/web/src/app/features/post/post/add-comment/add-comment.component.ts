import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Comment } from '@shared/core/supabase';
import { CommentForm } from './add-comment.models';
import { ProfileStore, ReaderApiService } from '../../../../core';
import { CommentsStore } from '../comments/comments.store';

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

  protected commentForm = new FormGroup<CommentForm>({
    content: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    }),
  });

  protected readonly isSubmitting: WritableSignal<boolean> = signal(false);

  private commentsStore = inject(CommentsStore);
  private userId = inject(ProfileStore).userId;

  async onSubmit(): Promise<void> {
    if (this.commentForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      try {
        const comment: Comment = {
          content: this.commentForm.controls.content.value,
          created_at: new Date().toISOString(),
          user_id: this.userId() ?? null,
          author: {
            created_at: 'a',
            id: 'a',
            avatar_url: null,
            username: 's'
          },
          post_id: this.postId(),
        };

        await this.commentsStore.addComment(this.postId(), comment);
        this.commentForm.reset();

        this.isSubmitting.set(false);
      } catch (error) {
        this.isSubmitting.set(false);
        console.error('Error adding comment:', error);
      }
    }
  }
}
