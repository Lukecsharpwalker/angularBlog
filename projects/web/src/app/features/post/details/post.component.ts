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

  private styleCodeBlock(element: HTMLElement): void {
    element.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
    
    // Check if it's a one-liner
    const isOneLiner = !element.textContent?.includes('\n') || element.textContent?.trim().split('\n').length === 1;
    
    if (isOneLiner) {
      element.classList.add('inline-block', 'px-2', 'py-1', 'text-sm');
      element.style.display = 'inline-block';
      element.style.margin = '0 2px';
    } else {
      element.classList.add('block', 'my-4');
    }
  }

  private showCodeModal(event: Event) {
    const preElement = event.currentTarget as HTMLElement;
    const codeElement = preElement.querySelector('code');
    const code = codeElement?.innerHTML || '';
    
    // Extract language from Highlight.js classes
    let language = 'code';
    if (codeElement) {
      const languageClass = Array.from(codeElement.classList).find(cls => 
        cls.startsWith('language-') || cls.startsWith('hljs-')
      );
      if (languageClass) {
        language = languageClass.replace('language-', '').replace('hljs-', '');
      }
    }

    // Format language name for display
    const displayLanguage = this.formatLanguageForDisplay(language);

    // Determine if this is a large code block - count actual text lines, not HTML
    const textContent = codeElement?.textContent || preElement.textContent || '';
    const lineCount = textContent.split('\n').length;
    const isLargeCode = lineCount > 10 || textContent.length > 500;

    this.dialogService.openDialog(
      this.viewContainerRef,
      {
        title: `${displayLanguage} Code`,
        content: '',
        primaryButton: 'Close',
        data: { 
          code, 
          language, 
          isLargeCode,
          lineCount
        },
      },
      CodeBlockModalComponent
    );
  }

  private formatLanguageForDisplay(language: string): string {
    const languageMap: Record<string, string> = {
      'js': 'JavaScript',
      'ts': 'TypeScript', 
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'json': 'JSON',
      'xml': 'XML',
      'bash': 'Bash',
      'sh': 'Shell',
      'cmd': 'Command',
      'powershell': 'PowerShell',
      'sql': 'SQL',
      'python': 'Python',
      'py': 'Python',
      'java': 'Java',
      'c': 'C',
      'cpp': 'C++',
      'csharp': 'C#',
      'php': 'PHP',
      'ruby': 'Ruby',
      'go': 'Go',
      'rust': 'Rust',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'dart': 'Dart',
      'yaml': 'YAML',
      'yml': 'YAML',
      'markdown': 'Markdown',
      'md': 'Markdown',
      'text': 'Plain Text',
      'code': 'Code'
    };
    
    return languageMap[language.toLowerCase()] || language.charAt(0).toUpperCase() + language.slice(1);
  }

  private addEventsForOpenModalWithCode() {
    afterNextRender(() => {
      // Wait a bit for content to be fully rendered
      setTimeout(() => {
        const processedNodes = new Set<Node>();

        const processCodeBlocks = () => {
          const preElements = document.querySelectorAll('pre');
          
          preElements.forEach((preElement) => {
            if (!processedNodes.has(preElement)) {
              processedNodes.add(preElement);
              this.styleCodeBlock(preElement);
              preElement.addEventListener('click', e => this.showCodeModal(e));
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
