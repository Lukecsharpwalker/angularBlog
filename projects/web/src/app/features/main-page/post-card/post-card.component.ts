import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '@shared/core/supabase';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'web-post-card',
  standalone: true,
  imports: [LabelComponent, RouterLink],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  readonly post = input.required<Post>();
}
