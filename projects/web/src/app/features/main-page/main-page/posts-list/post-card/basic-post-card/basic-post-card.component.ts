import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '@shared/core/supabase';
import { PostCardBodyComponent } from '../post-card-body/post-card-body.component';
import { PostTagComponent } from '../post-tag/post-tag.component';

@Component({
  selector: 'web-basic-post-card',
  standalone: true,
  imports: [PostCardBodyComponent, PostTagComponent, RouterLink],
  templateUrl: './basic-post-card.component.html',
})
export class BasicPostCardComponent {
  readonly post = input.required<Post>();
}
