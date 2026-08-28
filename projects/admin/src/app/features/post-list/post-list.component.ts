import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { DynamicDialogService, ModalCloseStatusEnum } from '@shared/pattern/dynamic-dialog';
import { IconComponent } from '@shared/pattern/icon-system';
import { ChipComponent } from '@shared/ui/chip';
import { PanelCardComponent } from '../../ui/panel-card';
import { StatCardComponent } from '../../ui/stat-card';
import { StatusChipComponent } from '../../ui/status-chip';
import { FilterChipComponent } from '../../ui/filter-chip';
import { PLACEHOLDER_POSTS } from './post-list.data';
import { PostListRow, PostStatusFilter } from './post-list.model';
import { ADMIN_ROUTE } from '../../core/routing/admin-routes';

@Component({
  selector: 'admin-post-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    IconComponent,
    PanelCardComponent,
    StatCardComponent,
    StatusChipComponent,
    FilterChipComponent,
    ChipComponent,
  ],
  templateUrl: './post-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  protected readonly postRoute = ADMIN_ROUTE.post;
  protected readonly newPostRoute = ADMIN_ROUTE.newPost;
  protected readonly statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Drafts', value: 'drafts' },
  ] as const;

  protected readonly statusFilter = signal<PostStatusFilter>('all');
  protected readonly posts = signal<PostListRow[]>(PLACEHOLDER_POSTS as PostListRow[]);

  protected readonly publishedCount = computed(
    () => this.posts().filter(post => !post.is_draft).length
  );

  protected readonly draftCount = computed(() => this.posts().filter(post => post.is_draft).length);

  protected readonly publishedShare = computed(() => {
    const total = this.posts().length;
    return total === 0 ? 0 : Math.round((this.publishedCount() / total) * 100);
  });

  protected readonly visiblePosts = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'published') {
      return this.posts().filter(post => !post.is_draft);
    }
    if (filter === 'drafts') {
      return this.posts().filter(post => post.is_draft);
    }
    return this.posts();
  });

  private readonly dialogService = inject(DynamicDialogService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  protected confirmDelete(post: PostListRow): void {
    this.dialogService
      .openDialog(this.viewContainerRef, {
        title: 'Delete post',
        content: `Delete "${post.title}"? This cannot be undone.`,
        primaryButton: 'Delete',
        secondaryButton: 'Cancel',
      })
      .pipe(take(1))
      .subscribe(status => {
        if (status.closeStatus === ModalCloseStatusEnum.ACCEPTED) {
          this.posts.update(posts => posts.filter(item => item.id !== post.id));
        }
      });
  }
}
