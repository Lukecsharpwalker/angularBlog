import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '@shared/pattern/icon-system';
import { ADMIN_ROUTE } from '../../core/routing/admin-routes';
import { SidenavItem } from './sidenav.model';

@Component({
  selector: 'admin-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  protected readonly brandLink = ADMIN_ROUTE.posts;
  protected readonly items: readonly SidenavItem[] = [
    { label: 'Posts', link: ADMIN_ROUTE.posts, icon: 'draft' },
    { label: 'New post', link: ADMIN_ROUTE.post, icon: 'plus' },
  ];
}
