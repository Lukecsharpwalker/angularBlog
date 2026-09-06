import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[sharedFocus]',
  standalone: true,
})
/** Apply on inputs in @if() to trap focus without a timeout(). */
export class SharedFocusDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender({ write: () => this.element.nativeElement.focus() });
  }
}
