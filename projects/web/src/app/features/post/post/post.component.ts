import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  input,
  OnInit,
  runInInjectionContext,
  Signal,
} from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '@shared/pattern/icon-system';
import { AvatarComponent } from '@shared/ui/avatar';
import { ChipComponent } from '@shared/ui/chip';
import { Post } from '@shared/core/supabase';
import { ProfileStore } from '../../../core';
import { CommentsComponent } from './comments/comments.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { PostStore } from '../post.store';
import { CommentsStore } from './comments/comments.store';
import { AuthorCardComponent } from './author-card/author-card.component';
import { PostContentComponent } from './post-content/post-content.component';
import { PostLoadingPlaceholderComponent } from './post-loading-placeholder/post-loading-placeholder.component';
import { SocialShareComponent } from './social-share/social-share.component';
import { TableOfContentsComponent } from './table-of-contents/table-of-contents.component';
import { readingTimeMinutes } from './post-content/reading-time';

@Component({
  selector: 'web-post',
  standalone: true,
  providers: [PostStore, CommentsStore],
  templateUrl: './post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AddCommentComponent,
    AuthorCardComponent,
    AvatarComponent,
    ChipComponent,
    CommentsComponent,
    DatePipe,
    IconComponent,
    NgOptimizedImage,
    PostContentComponent,
    PostLoadingPlaceholderComponent,
    RouterLink,
    SocialShareComponent,
    TableOfContentsComponent,
  ],
})
export class PostComponent implements OnInit {
  protected readonly id = input.required<string>();

  protected readonly postStore = inject(PostStore);
  protected readonly commentsStore = inject(CommentsStore);
  protected readonly userProfile = inject(ProfileStore).userProfile;

  protected readonly post: Signal<Post | null> = this.postStore.post;
  protected readonly loading: Signal<boolean> = this.postStore.loading;
  protected readonly error: Signal<string | null> = this.postStore.error;
  protected readonly tocItems = this.postStore.tableOfContents;
  protected readonly postTitle: Signal<string> = this.postStore.postTitle;

  protected readonly commentCount = this.commentsStore.total;

  protected readonly readingTime = computed(() => readingTimeMinutes(this.post()?.content));

  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    this.loadPost();
  }

  protected goBack(): void {
    void this.router.navigate(['']);
  }

  protected loadPost(): void {
    //TODO: Create a routes params service and inject to the store, to remove injectionconext
    // post about shared service, that info get form Michael
    runInInjectionContext(this.injector, () => {
      this.postStore.getPost(this.id());
      this.commentsStore.loadComments(this.id());
    });
  }
}
