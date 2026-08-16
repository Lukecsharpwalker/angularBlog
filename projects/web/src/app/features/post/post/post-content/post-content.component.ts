import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenCodeBlockModalDirective } from '../open-code-block-modal.directive';

@Component({
  selector: 'web-post-content',
  standalone: true,
  templateUrl: './post-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OpenCodeBlockModalDirective],
})
export class PostContentComponent {
  readonly content = input.required<string>();

  protected readonly safeContent = computed(() => {
    return this.sanitizer.bypassSecurityTrustHtml(this.content());
  });

  private readonly sanitizer = inject(DomSanitizer);

}
