import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[webAutofocus]',
  standalone: true,
})
/** Apply on inputs in @if() to trap focus without a timeout(). */
export class AutofocusDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender({ write: () => this.element.nativeElement.focus() });
  }
}
