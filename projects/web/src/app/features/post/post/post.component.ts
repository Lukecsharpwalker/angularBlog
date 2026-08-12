import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  Signal,
  computed,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IconComponent } from '@shared/pattern/icon-system';
import { Post } from '@shared/core/supabase';
import { ProfileStore, ReaderApiService } from '../../../core';
import { CommentsComponent } from './comments/comments.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { PostStore } from '../post.store';
import { SocialShareService } from './social-share.service';
import { CommentsStore } from './comments/comments.store';
import { OpenCodeBlockModalDirective } from './open-code-block-modal.directive';

@Component({
  selector: 'web-post',
  standalone: true,
  providers: [ReaderApiService, DatePipe, PostStore, CommentsStore],
  templateUrl: './post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommentsComponent,
    AddCommentComponent,
    DatePipe,
    NgOptimizedImage,
    IconComponent,
    OpenCodeBlockModalDirective,
  ],
})
export class PostComponent implements OnInit {
  protected readonly id = input.required<string>();
  protected router = inject(Router);
  protected postStore = inject(PostStore);
  protected readonly userProfile = inject(ProfileStore).userProfile;

  protected readonly post: Signal<Post | null> = this.postStore.post;
  protected readonly loading: Signal<boolean> = this.postStore.loading;
  protected readonly error: Signal<string | null> = this.postStore.error;
  protected readonly hasPost: Signal<boolean> = this.postStore.hasPost;
  protected readonly postTitle: Signal<string> = this.postStore.postTitle;
  protected readonly safeContent = computed(() => {
    const content = this.post()?.content;
    return content ? this.sanitizer.bypassSecurityTrustHtml(content) : '';
  });

  protected readonly tocItems = computed(() => [
    'Introduction',
    'Key Features',
    'Conclusion'
  ]);

  private socialShareService = inject(SocialShareService);
  private sanitizer = inject(DomSanitizer);
  private injector = inject(Injector);

  ngOnInit(): void {
    this.loadPost();
  }

  goBack(): void {
    this.router.navigate(['']);
  }

  shareOnSocial(platform: 'twitter' | 'linkedin'): void {
    this.socialShareService.shareOnSocial(platform, this.postTitle());
  }

  async copyLink(): Promise<void> {
    await this.socialShareService.copyLink();
  }

  loadPost(): void {
    //TODO: Create a routes params service and inject to the store, to remove injectionconext
    // post about shared service, that info get form Michael
    runInInjectionContext(this.injector, () => {
      this.postStore.getPost(this.id());
    });
  }
}
