import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideBell,
  lucideBookmark,
  lucideChevronRight,
  lucideChevronsUp,
  lucideCircleAlert,
  lucideFileText,
  lucideHeart,
  lucideHouse,
  lucideImage,
  lucideInfo,
  lucideLink,
  lucideMenu,
  lucideMessageSquare,
  lucidePencilLine,
  lucidePlus,
  lucideSearch,
  lucideShare,
  lucideTrash2,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';

const lucideLinkedin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;

export type IconName =
  | 'draft'
  | 'info'
  | 'edit'
  | 'comment'
  | 'error'
  | 'search'
  | 'home'
  | 'user'
  | 'like'
  | 'share'
  | 'bookmark'
  | 'chevron-right'
  | 'chevrons-up'
  | 'close'
  | 'menu'
  | 'trash'
  | 'plus'
  | 'bell'
  | 'image'
  | 'arrow-left'
  | 'arrow-right'
  | 'link'
  | 'linkedin';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const iconMapping: Record<IconName, string> = {
  draft: 'lucideFileText',
  info: 'lucideInfo',
  edit: 'lucidePencilLine',
  comment: 'lucideMessageSquare',
  error: 'lucideCircleAlert',
  search: 'lucideSearch',
  home: 'lucideHouse',
  user: 'lucideUser',
  like: 'lucideHeart',
  share: 'lucideShare',
  bookmark: 'lucideBookmark',
  'chevron-right': 'lucideChevronRight',
  'chevrons-up': 'lucideChevronsUp',
  close: 'lucideX',
  menu: 'lucideMenu',
  trash: 'lucideTrash2',
  plus: 'lucidePlus',
  bell: 'lucideBell',
  image: 'lucideImage',
  'arrow-left': 'lucideArrowLeft',
  'arrow-right': 'lucideArrowRight',
  link: 'lucideLink',
  linkedin: 'lucideLinkedin',
};

const sizeClasses: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
};

@Component({
  selector: 'shared-icon',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      lucideFileText,
      lucideInfo,
      lucidePencilLine,
      lucideUser,
      lucideMessageSquare,
      lucideCircleAlert,
      lucideSearch,
      lucideHouse,
      lucideHeart,
      lucideShare,
      lucideBookmark,
      lucideChevronRight,
      lucideChevronsUp,
      lucideX,
      lucideMenu,
      lucideTrash2,
      lucidePlus,
      lucideBell,
      lucideImage,
      lucideArrowLeft,
      lucideArrowRight,
      lucideLink,
      lucideLinkedin,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ng-icon
      [name]="getIconName()"
      [class]="getIconClasses()"
      [attr.aria-label]="ariaLabel() || name()"
    />
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<IconSize>('md');
  readonly className = input<string>('');
  readonly ariaLabel = input<string | undefined>(undefined);

  getIconName(): string {
    return iconMapping[this.name()] || iconMapping['info'];
  }

  getIconClasses(): string {
    const baseClasses = 'inline-block shrink-0';
    const sizeClass = sizeClasses[this.size()];

    return [baseClasses, sizeClass, this.className()].filter(Boolean).join(' ');
  }
}
