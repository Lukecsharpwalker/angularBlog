import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'web-about-me',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {}
