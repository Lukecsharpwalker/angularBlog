import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[sharedVerticalSwipe]',
  standalone: true,
  host: {
    '(pointerdown)': 'startSwipe($event)',
    '(pointermove)': 'moveSwipe($event)',
    '(pointerup)': 'endSwipe($event)',
    '(pointercancel)': 'cancelSwipe($event)',
    '(lostpointercapture)': 'cancelSwipe($event)',
  },
})
export class VerticalSwipeDirective {
  readonly swipeUp = output<void>();
  readonly swipeDown = output<void>();
  readonly swipeOffsetPx = output<number | null>();

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly minSwipeDistancePx = 48;
  private swipeStart: {
    pointerId: number;
    x: number;
    y: number;
  } | null = null;

  protected startSwipe(event: PointerEvent): void {
    if (!event.isPrimary || event.button !== 0 || this.swipeStart) {
      return;
    }

    this.swipeStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };

    this.elementRef.nativeElement.setPointerCapture(event.pointerId);
    this.swipeOffsetPx.emit(0);
  }

  protected moveSwipe(event: PointerEvent): void {
    const start = this.swipeStart;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    this.swipeOffsetPx.emit(Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : 0);
  }

  protected endSwipe(event: PointerEvent): void {
    const start = this.swipeStart;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    this.swipeStart = null;
    this.swipeOffsetPx.emit(null);

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaY) < this.minSwipeDistancePx || Math.abs(deltaY) <= Math.abs(deltaX)) {
      return;
    }

    if (deltaY < 0) {
      this.swipeUp.emit();
    } else {
      this.swipeDown.emit();
    }
  }

  protected cancelSwipe(event: PointerEvent): void {
    if (this.swipeStart?.pointerId === event.pointerId) {
      this.swipeStart = null;
      this.swipeOffsetPx.emit(null);
    }
  }
}
