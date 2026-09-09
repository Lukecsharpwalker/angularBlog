import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'shared-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-checked]': 'isChecked() || null',
    '[attr.data-disabled]': 'isDisabled() || null',
  },
})
export class ToggleComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hideLabel = input(false, { transform: booleanAttribute });
  readonly describedBy = input<string | null>(null);

  readonly checkedChange = output<boolean>();

  protected readonly isChecked = computed(() => this.formValue() ?? this.checked());
  protected readonly isDisabled = computed(() => this.formDisabled() ?? this.disabled());

  private readonly formValue = signal<boolean | undefined>(undefined);
  private readonly formDisabled = signal<boolean | undefined>(undefined);
  private onFormChange?: (value: boolean) => void;
  private onFormTouched?: () => void;

  writeValue(value: unknown): void {
    this.formValue.set(!!value);
  }

  registerOnChange(onChange: (value: boolean) => void): void {
    this.onFormChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onFormTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected onToggle(input: HTMLInputElement): void {
    const value = input.checked;
    input.checked = this.isChecked();

    if (this.formValue() !== undefined) {
      this.formValue.set(value);
    }
    this.onFormChange?.(value);
    this.checkedChange.emit(value);
  }

  protected onBlur(): void {
    this.onFormTouched?.();
  }
}
