import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PostsListComponent } from './posts-list/posts-list.component';

@Component({
  selector: 'web-main-page',
  standalone: true,
  imports: [PostsListComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {}
