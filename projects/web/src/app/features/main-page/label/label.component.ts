import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'web-label',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
})
export class LabelComponent {
  readonly text = input<string>('Label');
  readonly color = input<string>('#000000');
}
