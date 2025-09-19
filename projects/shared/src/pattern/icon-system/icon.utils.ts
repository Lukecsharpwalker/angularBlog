import type { IconName, IconConfig, IconSize, IconVariant } from './icon.models';

export function createIconConfig(
  name: IconName,
  options?: {
    size?: IconSize;
    variant?: IconVariant;
    className?: string;
    ariaLabel?: string;
  }
): IconConfig {
  return {
    name,
    size: options?.size || 'md',
    variant: options?.variant || 'outline',
    className: options?.className || '',
    ariaLabel: options?.ariaLabel
  };
}

export const ICON_MAPPINGS = {
  'Loading Post': 'loading',
  'Editing Mode': 'editing',
  'New Draft': 'draft',
  'Publishing...': 'publishing',
  'Saving...': 'saving',
  'All changes saved': 'saved',
  'Article Information': 'info',
  'Add Comment': 'comment',
  'Comments': 'comments',
  'Hi I\'m': 'wave',
  'Tags & Categories': 'tag',
  'Content Editor': 'edit'
} as const;

export type TextToIconKey = keyof typeof ICON_MAPPINGS;

export function getIconNameFromText(text: TextToIconKey): IconName {
  return ICON_MAPPINGS[text] as IconName;
}

export function createIconFromText(
  text: TextToIconKey,
  options?: {
    size?: IconSize;
    variant?: IconVariant;
    className?: string;
    ariaLabel?: string;
  }
): IconConfig {
  const iconName = getIconNameFromText(text);
  return createIconConfig(iconName, options);
}

export const CONTENT_STATUS_ICONS: Record<string, IconConfig> = {
  loading: { name: 'loading', size: 'sm', variant: 'outline', ariaLabel: 'Loading content' },
  editing: { name: 'editing', size: 'sm', variant: 'solid', ariaLabel: 'Currently editing' },
  draft: { name: 'draft', size: 'sm', variant: 'outline', ariaLabel: 'Draft post' },
  publishing: { name: 'publishing', size: 'sm', variant: 'outline', ariaLabel: 'Publishing post' },
  saving: { name: 'saving', size: 'sm', variant: 'outline', ariaLabel: 'Saving changes' },
  saved: { name: 'saved', size: 'sm', variant: 'solid', ariaLabel: 'Changes saved' },
  success: { name: 'success', size: 'sm', variant: 'solid', ariaLabel: 'Success' },
  error: { name: 'error', size: 'sm', variant: 'solid', ariaLabel: 'Error occurred' },
  warning: { name: 'warning', size: 'sm', variant: 'solid', ariaLabel: 'Warning' }
};

export const NAVIGATION_ICONS: Record<string, IconConfig> = {
  home: { name: 'home', size: 'md', variant: 'outline', ariaLabel: 'Home' },
  user: { name: 'user', size: 'md', variant: 'outline', ariaLabel: 'User profile' },
  settings: { name: 'settings', size: 'md', variant: 'outline', ariaLabel: 'Settings' },
  search: { name: 'search', size: 'md', variant: 'outline', ariaLabel: 'Search' },
  menu: { name: 'menu', size: 'md', variant: 'outline', ariaLabel: 'Menu' },
  close: { name: 'close', size: 'md', variant: 'outline', ariaLabel: 'Close' }
};

export const CONTENT_METADATA_ICONS: Record<string, IconConfig> = {
  author: { name: 'author', size: 'sm', variant: 'outline', ariaLabel: 'Author' },
  category: { name: 'category', size: 'sm', variant: 'outline', ariaLabel: 'Category' },
  time: { name: 'time', size: 'sm', variant: 'outline', ariaLabel: 'Time' },
  difficulty: { name: 'difficulty', size: 'sm', variant: 'outline', ariaLabel: 'Difficulty level' },
  tag: { name: 'tag', size: 'sm', variant: 'outline', ariaLabel: 'Tag' },
  calendar: { name: 'calendar', size: 'sm', variant: 'outline', ariaLabel: 'Date' },
  clock: { name: 'clock', size: 'sm', variant: 'outline', ariaLabel: 'Time' },
  eye: { name: 'eye', size: 'sm', variant: 'outline', ariaLabel: 'Views' }
};

export const INTERACTION_ICONS: Record<string, IconConfig> = {
  like: { name: 'like', size: 'md', variant: 'outline', ariaLabel: 'Like' },
  share: { name: 'share', size: 'md', variant: 'outline', ariaLabel: 'Share' },
  bookmark: { name: 'bookmark', size: 'md', variant: 'outline', ariaLabel: 'Bookmark' },
  comment: { name: 'comment', size: 'md', variant: 'outline', ariaLabel: 'Comment' },
  star: { name: 'star', size: 'md', variant: 'outline', ariaLabel: 'Star' }
};