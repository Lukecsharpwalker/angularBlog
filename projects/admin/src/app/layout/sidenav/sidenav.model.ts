import { IconName } from '@shared/pattern/icon-system';

export interface SidenavItem {
  readonly label: string;
  readonly link: string;
  readonly icon: IconName;
}
