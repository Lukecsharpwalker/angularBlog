import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { IconComponent } from '@shared/pattern/icon-system';
import { PostStore } from '../../post.store';
import { CommentsStore } from '../comments/comments.store';
import { SocialShareComponent } from '../social-share/social-share.component';
import { AngularCdkTeleportService } from '../../../../core';

@Component({
  selector: 'web-post-mobile-bottom-actions',
  standalone: true,
  imports: [IconComponent, SocialShareComponent, CdkPortal],
  templateUrl: './post-mobile-bottom-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeShareMenuAndRestoreFocus()',
    '(document:click)': 'closeShareMenuOnOutsideClick($event.target)',
  },
})
export class PostMobileBottomActionsComponent implements OnInit, OnDestroy {
  protected readonly commentCount = inject(CommentsStore).total;
  protected readonly shareMenuOpen = signal(false);
  protected readonly liked = signal(false);
  protected readonly likeCount = signal(0);
  protected readonly saved = signal(false);

  private readonly postStore = inject(PostStore);
  private readonly angularCdkTeleportService = inject(AngularCdkTeleportService);

  private readonly contentToTeleport = viewChild(CdkPortal);
  private readonly portalContent = viewChild<ElementRef<HTMLDivElement>>('portalContent');
  private readonly shareToggleButton =
    viewChild<ElementRef<HTMLButtonElement>>('shareToggleButton');

  ngOnInit(): void {
    this.registerPortal();
  }

  ngOnDestroy(): void {
    this.unregisterPortal();
  }

  // TODO: Will be done in next iteration
  protected toggleLike(): void {
    this.liked.update(value => !value);
    this.likeCount.update(count => (this.liked() ? count + 1 : count - 1));
  }

  // TODO: Will be done in next iteration
  protected toggleSaved(): void {
    this.saved.update(value => !value);
  }

  protected toggleShareMenu(): void {
    this.shareMenuOpen.update(open => !open);
  }

  protected closeShareMenuAndRestoreFocus(): void {
    if (!this.shareMenuOpen()) {
      return;
    }

    this.shareMenuOpen.set(false);
    this.shareToggleButton()?.nativeElement.focus();
  }

  protected closeShareMenuOnOutsideClick(target: Node | null): void {
    const content = this.portalContent()?.nativeElement;

    if (content && !content.contains(target)) {
      this.shareMenuOpen.set(false);
    }
  }

  protected scrollToComments(): void {
    document.querySelector('web-comments')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  //TODO: github.com/Lukecsharpwalker/angularBlog/issues/128
  protected scrollToTop(): void {
    const heading = document.getElementById(this.postStore.firstHeading());
    const rect = heading?.getBoundingClientRect();
    const visible = !!rect && rect.top < window.innerHeight && rect.bottom > 0;

    //If the first heading is visible, scroll to the top of the page, otherwise scroll to the first heading
    if (visible) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      document.getElementById(this.postStore.firstHeading())?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  private registerPortal(): void {
    const portal = this.contentToTeleport();

    if (!portal) {
      return;
    }

    this.angularCdkTeleportService.teleport(portal);
  }

  private unregisterPortal(): void {
    this.angularCdkTeleportService.finishTeleportation();
  }
}
