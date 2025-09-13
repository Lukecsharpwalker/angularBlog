import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  ViewContainerRef,
  input,
  DestroyRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { ReaderApiService } from '../../../core/blog/reader-api.service';
import { CommentsComponent } from '../comments/comments.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { PostStore } from '../post.store';
import { CommentsStore } from '../comments.store';
import { SocialShareService } from '../social-share.service';
import { PostService } from '../post.service';

@Component({
  selector: 'web-post',
  standalone: true,
  providers: [ReaderApiService, DatePipe, PostStore, CommentsStore, PostService],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommentsComponent, AddCommentComponent, DatePipe, HighlightModule],
})
export class PostComponent implements OnInit {
  readonly id = input.required<string>();
  router = inject(Router);
  postStore = inject(PostStore);
  readonly post = this.postStore.post;
  readonly date = this.postStore.formattedDate;

  private destroyRef = inject(DestroyRef);
  private postService = inject(PostService);
  private dialogService = inject(DynamicDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private socialShareService = inject(SocialShareService);

  constructor() {
    this.postService.initializeCodeBlockHandling(
      this.dialogService,
      this.viewContainerRef,
      this.destroyRef
    );
  }

  ngOnInit(): void {
    this.loadPost();
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }

  shareOnSocial(platform: 'twitter' | 'linkedin'): void {
    const post = this.post();
    if (!post) return;

    this.socialShareService.shareOnSocial(platform, post.title);
  }

  async copyLink(): Promise<void> {
    const success = await this.socialShareService.copyLink();
    if (success) {
      console.log('Link copied to clipboard');
    } else {
      console.error('Failed to copy link');
    }
  }

  private loadPost(): void {
    this.postStore.getPost(this.id());
  }
}
