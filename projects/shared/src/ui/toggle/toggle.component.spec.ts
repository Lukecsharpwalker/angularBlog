import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleComponent } from './toggle.component';

@Component({
  imports: [ReactiveFormsModule, ToggleComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <shared-toggle label="Analytics cookies" formControlName="analytics" />
      <shared-toggle label="Marketing cookies" [formControl]="marketing" />
    </form>
  `,
})
class ToggleFormHost {
  readonly form = new FormGroup({ analytics: new FormControl(false) });
  readonly marketing = new FormControl(false, { updateOn: 'blur' });
}

describe('ToggleComponent', () => {
  let fixture: ComponentFixture<ToggleComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToggleComponent] }).compileComponents();
    fixture = TestBed.createComponent(ToggleComponent);
    fixture.componentRef.setInput('label', 'Analytics cookies');
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('emits the requested value and keeps the parent in control of checked state', () => {
    const changed = jasmine.createSpy('checkedChange');
    fixture.componentInstance.checkedChange.subscribe(changed);

    input.click();
    fixture.detectChanges();

    expect(changed).toHaveBeenCalledOnceWith(true);
    expect(input.checked).toBeFalse();

    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(input.checked).toBeTrue();
  });

  it('prevents interaction when disabled while preserving its checked state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    const changed = jasmine.createSpy('checkedChange');
    fixture.componentInstance.checkedChange.subscribe(changed);

    input.click();

    expect(changed).not.toHaveBeenCalled();
    expect(input.disabled).toBeTrue();
    expect(input.checked).toBeTrue();
  });

  it('names a toggle without a visible label and connects its description', () => {
    fixture.componentRef.setInput('hideLabel', true);
    fixture.componentRef.setInput('describedBy', 'analytics-description');
    fixture.detectChanges();

    expect(input.getAttribute('role')).toBe('switch');
    expect(input.getAttribute('aria-label')).toBe('Analytics cookies');
    expect(input.getAttribute('aria-describedby')).toBe('analytics-description');
    expect(fixture.nativeElement.textContent).not.toContain('Analytics cookies');
  });
});

describe('ToggleComponent reactive forms', () => {
  let fixture: ComponentFixture<ToggleFormHost>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToggleFormHost] }).compileComponents();
    fixture = TestBed.createComponent(ToggleFormHost);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('updates a named control from user input and marks it dirty', () => {
    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls.analytics.value).toBeTrue();
    expect(fixture.componentInstance.form.controls.analytics.dirty).toBeTrue();
    expect(input.checked).toBeTrue();
  });

  it('reflects programmatic values and nullable resets without duplicate emissions', () => {
    const control = fixture.componentInstance.form.controls.analytics;
    const changed = jasmine.createSpy('valueChanges');
    control.valueChanges.subscribe(changed);

    control.setValue(true);
    fixture.detectChanges();
    expect(input.checked).toBeTrue();
    expect(changed).toHaveBeenCalledOnceWith(true);

    control.reset();
    fixture.detectChanges();
    expect(input.checked).toBeFalse();
    expect(control.value).toBeNull();
    expect(changed).toHaveBeenCalledTimes(2);
  });

  it('reflects disabled state and allows interaction after re-enabling', () => {
    const control = fixture.componentInstance.form.controls.analytics;
    control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBeTrue();
    input.click();
    expect(control.value).toBeFalse();

    control.enable();
    fixture.detectChanges();
    expect(input.disabled).toBeFalse();
    input.click();
    expect(control.value).toBeTrue();
  });

  it('marks the control touched on blur', () => {
    const control = fixture.componentInstance.form.controls.analytics;
    expect(control.touched).toBeFalse();
    input.dispatchEvent(new Event('blur'));
    expect(control.touched).toBeTrue();
  });

  it('supports a standalone FormControl with updateOn blur', () => {
    const marketingInput: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[1];
    marketingInput.click();
    fixture.detectChanges();
    expect(marketingInput.checked).toBeTrue();
    expect(fixture.componentInstance.marketing.value).toBeFalse();

    marketingInput.dispatchEvent(new Event('blur'));
    expect(fixture.componentInstance.marketing.value).toBeTrue();
    expect(fixture.componentInstance.marketing.touched).toBeTrue();
  });
});
