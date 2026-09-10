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
  ViewContainerRef,
} from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { filter, map, take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '@shared/pattern/icon-system';
import { AvatarComponent } from '@shared/ui/avatar';
import { ChipComponent } from '@shared/ui/chip';
import { Post } from '@shared/core/supabase';
import { ProfileStore } from '../../../core';
import { SocialShareComponent } from './social-share/social-share.component';
import { CommentsComponent } from './comments/comments.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { PostStore } from '../post.store';
import { CommentsStore } from './comments/comments.store';
import { AuthorCardComponent } from './author-card/author-card.component';
import { PostContentComponent } from './post-content/post-content.component';
import { PostErrorComponent } from './post-error/post-error.component';
import { PostLoadingPlaceholderComponent } from './post-loading-placeholder/post-loading-placeholder.component';
import { TableOfContentsComponent } from './table-of-contents/table-of-contents.component';
import { readingTimeMinutes } from './post-content/reading-time';
import { PostMobileToolbarComponent } from './post-mobile-toolbar/post-mobile-toolbar.component';
import { ObserveActiveHeadingDirective } from './observe-active-heading.directive';
import { PostMobileBottomActionsComponent } from './post-mobile-bottom-actions/post-mobile-bottom-actions.component';
import { DynamicDialogService, ModalCloseStatusEnum } from '@shared/pattern/dynamic-dialog';
import { TableOfContentsDialogComponent } from './table-of-contents/table-of-contents-dialog.component';

@Component({
  selector: 'web-post',
  standalone: true,
  templateUrl: './post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PostStore, CommentsStore],
  imports: [
    AddCommentComponent,
    AuthorCardComponent,
    AvatarComponent,
    ChipComponent,
    CommentsComponent,
    DatePipe,
    IconComponent,
    PostMobileBottomActionsComponent,
    ObserveActiveHeadingDirective,
    PostMobileToolbarComponent,
    NgOptimizedImage,
    PostContentComponent,
    PostErrorComponent,
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
  protected readonly commentCount = this.commentsStore.total;

  protected readonly readingTime = computed(() => readingTimeMinutes(this.post()?.content));

  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly dynamicDialogService = inject(DynamicDialogService<string>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.loadPost();
  }

  protected goBack(): void {
    void this.router.navigate(['']);
  }

  protected openTableOfContents(): void {
    const items = this.tocItems();
    if (!items?.length) {
      return;
    }

    this.dynamicDialogService
      .openDialog(
        this.viewContainerRef,
        {
          title: 'On this page',
          variant: 'sheet',
        },
        TableOfContentsDialogComponent
      )
      .pipe(
        take(1),
        filter(({ closeStatus }) => closeStatus === ModalCloseStatusEnum.ACCEPTED),
        map(({ data }) => data),
        //Should always return id, so filter to get rid of undefined
        filter(Boolean)
      )
      .subscribe(sectionId => {
        // IOS hack, need to restore postion after dialog blocks BG fixed,
        // otherwise scrollIntoView will scroll from the top of the page, not from the current position.
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      });
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
