import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  ViewContainerRef,
  input,
  DestroyRef,
  Signal,
} from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { User } from '@supabase/supabase-js';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { IconComponent } from '@shared/pattern/icon-system';
import { ReaderApiService } from '../../../core';
import { CommentsComponent } from './comments/comments.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { PostStore } from '../post.store';
import { SocialShareService } from './social-share.service';
import { PostService } from '../post.service';
import { CommentsStore } from './comments.store';
import { AuthStore } from '@shared/core/auth';
import { Post } from '@shared/core/supabase';

@Component({
  selector: 'web-post',
  standalone: true,
  providers: [ReaderApiService, DatePipe, PostStore, CommentsStore, PostService],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommentsComponent,
    AddCommentComponent,
    DatePipe,
    HighlightModule,
    NgOptimizedImage,
    IconComponent,
  ],
})
export class PostComponent implements OnInit {
  protected readonly id = input.required<string>();
  protected router = inject(Router);
  protected postStore = inject(PostStore);
  protected readonly user: Signal<User | null> = inject(AuthStore).user;

  protected readonly post: Signal<Post | null> = this.postStore.post;
  protected readonly loading: Signal<boolean> = this.postStore.loading;
  protected readonly error: Signal<string | null> = this.postStore.error;
  protected readonly hasPost: Signal<boolean> = this.postStore.hasPost;
  protected readonly postTitle: Signal<string> = this.postStore.postTitle;
  protected readonly date: Signal<string> = this.postStore.formattedDate;

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
    this.socialShareService.shareOnSocial(platform, this.postTitle());
  }

  async copyLink(): Promise<void> {
    await this.socialShareService.copyLink();
  }

  loadPost(): void {
    this.postStore.getPost(this.id());
  }
}
