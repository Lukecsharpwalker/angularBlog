import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideArrowUp,
  lucideBell,
  lucideBookmark,
  lucideCalendar,
  lucideChartBar,
  lucideCheck,
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsUp,
  lucideChevronUp,
  lucideCircleAlert,
  lucideClock,
  lucideEye,
  lucideFileText,
  lucideFolderOpen,
  lucideHeart,
  lucideHouse,
  lucideImage,
  lucideInfo,
  lucideLink,
  lucideLoader,
  lucideLock,
  lucideMenu,
  lucideMessageCircle,
  lucideMessageSquare,
  lucidePencil,
  lucidePencilLine,
  lucidePlus,
  lucideRocket,
  lucideSave,
  lucideSearch,
  lucideSettings,
  lucideShare,
  lucideStar,
  lucideTag,
  lucideTrash2,
  lucideUser,
  lucideWaves,
  lucideX,
} from '@ng-icons/lucide';

const lucideLinkedin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;

const lucideTwitter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`;

export type IconName =
  | 'loading'
  | 'editing'
  | 'draft'
  | 'publishing'
  | 'saving'
  | 'saved'
  | 'info'
  | 'tag'
  | 'edit'
  | 'category'
  | 'time'
  | 'author'
  | 'clock'
  | 'difficulty'
  | 'comment'
  | 'comments'
  | 'error'
  | 'search'
  | 'wave'
  | 'home'
  | 'user'
  | 'settings'
  | 'like'
  | 'share'
  | 'bookmark'
  | 'star'
  | 'calendar'
  | 'eye'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevrons-up'
  | 'chevron-down'
  | 'close'
  | 'menu'
  | 'lock'
  | 'trash'
  | 'plus'
  | 'bell'
  | 'image'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'link'
  | 'twitter'
  | 'linkedin';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const iconMapping: Record<IconName, string> = {
  loading: 'lucideLoader',
  editing: 'lucidePencil',
  draft: 'lucideFileText',
  publishing: 'lucideRocket',
  saving: 'lucideSave',
  saved: 'lucideCheck',
  info: 'lucideInfo',
  tag: 'lucideTag',
  edit: 'lucidePencilLine',
  category: 'lucideFolderOpen',
  time: 'lucideClock',
  author: 'lucideUser',
  clock: 'lucideClock',
  difficulty: 'lucideChartBar',
  comment: 'lucideMessageSquare',
  comments: 'lucideMessageCircle',
  error: 'lucideCircleAlert',
  search: 'lucideSearch',
  wave: 'lucideWaves',
  home: 'lucideHouse',
  user: 'lucideUser',
  settings: 'lucideSettings',
  like: 'lucideHeart',
  share: 'lucideShare',
  bookmark: 'lucideBookmark',
  star: 'lucideStar',
  calendar: 'lucideCalendar',
  eye: 'lucideEye',
  'chevron-left': 'lucideChevronLeft',
  'chevron-right': 'lucideChevronRight',
  'chevron-up': 'lucideChevronUp',
  'chevrons-up': 'lucideChevronsUp',
  'chevron-down': 'lucideChevronDown',
  close: 'lucideX',
  menu: 'lucideMenu',
  lock: 'lucideLock',
  trash: 'lucideTrash2',
  plus: 'lucidePlus',
  bell: 'lucideBell',
  image: 'lucideImage',
  'arrow-left': 'lucideArrowLeft',
  'arrow-right': 'lucideArrowRight',
  'arrow-up': 'lucideArrowUp',
  link: 'lucideLink',
  twitter: 'lucideTwitter',
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
      lucideLoader,
      lucidePencil,
      lucideFileText,
      lucideRocket,
      lucideSave,
      lucideCheck,
      lucideInfo,
      lucideTag,
      lucidePencilLine,
      lucideFolderOpen,
      lucideClock,
      lucideUser,
      lucideChartBar,
      lucideMessageSquare,
      lucideMessageCircle,
      lucideCircleAlert,
      lucideSearch,
      lucideWaves,
      lucideHouse,
      lucideSettings,
      lucideHeart,
      lucideShare,
      lucideBookmark,
      lucideStar,
      lucideCalendar,
      lucideEye,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsUp,
      lucideChevronUp,
      lucideChevronDown,
      lucideX,
      lucideMenu,
      lucideLock,
      lucideTrash2,
      lucidePlus,
      lucideBell,
      lucideImage,
      lucideArrowLeft,
      lucideArrowRight,
      lucideArrowUp,
      lucideLink,
      lucideTwitter,
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
