import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-image',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-image.component.html',
  styleUrl: './add-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddImageComponent {

}





