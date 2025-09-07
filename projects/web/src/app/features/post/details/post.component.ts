import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  ViewContainerRef,
  afterNextRender,
  Signal,
  input,
  DestroyRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { ReaderApiService } from '../../../core/services/reader-api.service';
import { CommentsComponent } from './comments/comments.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { CodeBlockModalComponent } from './code-block-modal-component/code-block-modal-component.component';
import { PostStore } from './post.store';
import { CommentsStore } from './comments/comments.store';
import { SocialShareService } from './services/social-share.service';
import { Post } from 'shared';
import { DynamicDialogService } from 'shared';

@Component({
  selector: 'web-post',
  standalone: true,
  providers: [ReaderApiService, DatePipe, PostStore, CommentsStore],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommentsComponent, AddCommentComponent, DatePipe, HighlightModule],
})
export class PostComponent implements OnInit {
  readonly id = input.required<string>();
  private destroyRef = inject(DestroyRef);

  router = inject(Router);
  postStore = inject(PostStore);

  readonly post: Signal<Post | null> = this.postStore.post;
  readonly date: Signal<string | null> = this.postStore.formattedDate;

  private dialogService = inject(DynamicDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private socialShareService = inject(SocialShareService);

  constructor() {
    this.addEventsForOpenModalWithCode();
  }

  ngOnInit() {
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
      // TODO: Add toast notification for successful copy
      console.log('Link copied to clipboard');
    } else {
      console.error('Failed to copy link');
    }
  }

  private loadPost(): void {
    this.postStore.getPost(this.id());
  }

  private showCodeModal(event: Event) {
    const preElement = event.currentTarget as HTMLElement;
    const codeElement = preElement.querySelector('code');
    const code = codeElement?.innerHTML || '';
    const language = preElement.getAttribute('data-language') || '';

    this.dialogService.openDialog(
      this.viewContainerRef,
      {
        title: `${language.toUpperCase()} Code`,
        content: '',
        primaryButton: 'Close',
        data: { code, language },
      },
      CodeBlockModalComponent
    );
  }

  private addEventsForOpenModalWithCode() {
    afterNextRender(() => {
      // Wait a bit for content to be fully rendered
      setTimeout(() => {
        const processedNodes = new Set<Node>();

        const processCodeBlocks = () => {
          const preElements = document.querySelectorAll('pre code[class*="language-"], pre code[class*="hljs"]');
          
          preElements.forEach((codeElement) => {
            const preElement = codeElement.parentElement as HTMLElement;
            if (preElement && !processedNodes.has(preElement)) {
              processedNodes.add(preElement);
              
              // Extract language from class
              const languageClass = Array.from(codeElement.classList).find(cls => 
                cls.startsWith('language-') || cls.startsWith('hljs')
              );
              const language = languageClass ? languageClass.replace('language-', '').replace('hljs-', '') : 'code';
              
              // Set data attribute for styling
              preElement.setAttribute('data-language', language);
              preElement.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
              preElement.addEventListener('click', e => this.showCodeModal(e));
            }
          });

          // Also handle simple pre elements without specific highlighting
          const simplePres = document.querySelectorAll('pre:not([data-language])');
          simplePres.forEach(pre => {
            if (!processedNodes.has(pre)) {
              processedNodes.add(pre);
              pre.setAttribute('data-language', 'text');
              pre.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
              pre.addEventListener('click', e => this.showCodeModal(e));
            }
          });
        };

        // Initial processing
        processCodeBlocks();

        // Set up observer for dynamic content
        const observer = new MutationObserver(() => {
          processCodeBlocks();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Clean up observer when component is destroyed
        this.destroyRef.onDestroy(() => {
          observer.disconnect();
          processedNodes.clear();
        });
      }, 100);
    });
  }
}
