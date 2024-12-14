import {Component, computed, inject, input} from '@angular/core';
import {Post} from "../../../../../shared/_models/post.interface";
import {DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {LabelComponent} from "../label/label.component";
import {DomSanitizer} from "@angular/platform-browser";
import {TAGS} from "../../../../../utlis/tags";

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    LabelComponent
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  tagsMock = ['HTML', 'CSS', 'TypeScript', 'SSG/SSR']
  tags = TAGS.filter(tag => this.tagsMock.includes(tag.tag));
  sanitizer = inject(DomSanitizer);

  post = input.required<Post>();
  sanitizedContent = computed(() => {
    return this.sanitizer.bypassSecurityTrustHtml(this.post().content.toString().substring(0, 1000));
  })

}
