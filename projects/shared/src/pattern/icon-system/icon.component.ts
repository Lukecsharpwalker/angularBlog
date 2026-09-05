import { Component, input } from '@angular/core';
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
  lucideLinkedin,
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
  lucideTwitter,
  lucideUser,
  lucideWaves,
  lucideX,
} from '@ng-icons/lucide';

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
