import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabelComponent } from '../label/label.component';
import { Post } from 'shared';

@Component({
  selector: 'web-post-card',
  standalone: true,
  imports: [LabelComponent, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  public readonly post = input.required<Post>();
}
