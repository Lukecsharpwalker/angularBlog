import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { IconComponent } from '@shared/pattern/icon-system';

@Component({
  selector: 'web-about-me',
  standalone: true,
  imports: [NgOptimizedImage, IconComponent],
  templateUrl: './about-me.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {}
