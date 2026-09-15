import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { DynamicDialogService, ModalCloseStatusEnum } from '@shared/pattern/dynamic-dialog';
import { IconComponent } from '@shared/pattern/icon-system';
import { ChipComponent } from '@shared/ui/chip';
import { PanelCardComponent } from '../../ui/panel-card';
import { StatCardComponent } from '../../ui/stat-card';
import { StatusChipComponent } from '../../ui/status-chip';
import { FilterChipComponent } from '../../ui/filter-chip';
import { PostStatusFilter } from './post-list.model';
import { ADMIN_ROUTE } from '../../core/routing/admin-routes';
import { PostListStore } from './post-list.store';
import { PostListItem, PostListService } from './post-list.service';

@Component({
  selector: 'admin-post-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    IconComponent,
    PanelCardComponent,
    StatCardComponent,
    StatusChipComponent,
    FilterChipComponent,
    ChipComponent,
  ],
  providers: [PostListStore, PostListService],
  templateUrl: './post-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  protected readonly postRoute = ADMIN_ROUTE.post;
  protected readonly newPostRoute = ADMIN_ROUTE.newPost;
  protected readonly statusFilters: PostStatusFilter[] = ['All', 'Published', 'Drafts'];

  protected readonly statusFilter = signal<PostStatusFilter>('All');
  protected readonly posts = inject(PostListStore).postList;

  protected readonly publishedCount = computed(
    () => this.posts().filter(post => !post.is_draft).length
  );

  protected readonly draftCount = computed(() => this.posts().filter(post => post.is_draft).length);

  protected readonly publishedShare = computed(() => {
    const total = this.posts().length;
    return total === 0 ? 0 : Math.round((this.publishedCount() / total) * 100);
  });

  protected readonly visiblePosts = computed(() =>
    this.statusFilter() === 'All'
      ? this.posts()
      : this.posts().filter(post => post.is_draft === (this.statusFilter() === 'Drafts'))
  );

  private readonly dialogService = inject(DynamicDialogService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  protected confirmDelete(post: PostListItem): void {
    this.dialogService
      .openDialog(this.viewContainerRef, {
        title: 'Delete post?',
        variant: 'standard',
        content: `"${post.title}" will be permanently deleted.`,
        deleteButton: 'Delete post',
        secondaryButton: 'Cancel',
      })
      .pipe(take(1))
      .subscribe(status => {
        if (status.closeStatus === ModalCloseStatusEnum.ACCEPTED) {
          console.log(`Post "${post.title}" deleted.`);
        }
      });
  }
}
