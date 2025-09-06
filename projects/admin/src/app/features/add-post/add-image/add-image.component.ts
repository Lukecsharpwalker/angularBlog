import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddImageControls } from './add-image-controls.interface';

@Component({
  selector: 'admin-add-image',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddImageComponent {
  protected form = new FormGroup<AddImageControls>({
    src: new FormControl<string | null>('', [
      Validators.required,
      Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i),
    ]),
    alt: new FormControl<string | null>('', [Validators.required]),
  });
}
