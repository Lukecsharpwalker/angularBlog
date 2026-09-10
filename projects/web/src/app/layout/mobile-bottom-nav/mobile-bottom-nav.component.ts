import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AngularCdkTeleportService } from '../../core';
import { DefaultMobileBottomActionsComponent } from './default-mobile-bottom-actions/default-mobile-bottom-actions.component';

@Component({
  selector: 'web-mobile-bottom-nav',
  standalone: true,
  imports: [CdkPortalOutlet, DefaultMobileBottomActionsComponent],
  templateUrl: './mobile-bottom-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomNavComponent {
  readonly angularCdkPortal = inject(AngularCdkTeleportService).portal;
}
