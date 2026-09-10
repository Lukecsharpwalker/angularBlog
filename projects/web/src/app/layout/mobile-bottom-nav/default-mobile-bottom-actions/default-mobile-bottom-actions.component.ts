import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '@shared/pattern/icon-system';

@Component({
  selector: 'web-default-mobile-bottom-actions',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './default-mobile-bottom-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultMobileBottomActionsComponent {}
