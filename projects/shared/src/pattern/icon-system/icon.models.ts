export type IconName =
  | 'loading'
  | 'editing'
  | 'draft'
  | 'publishing'
  | 'saving'
  | 'saved'
  | 'info'
  | 'document'
  | 'comment'
  | 'comments'
  | 'wave'
  | 'tag'
  | 'edit'
  | 'write'
  | 'home'
  | 'user'
  | 'settings'
  | 'success'
  | 'error'
  | 'warning'
  | 'author'
  | 'category'
  | 'time'
  | 'difficulty'
  | 'search'
  | 'close'
  | 'menu'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'like'
  | 'share'
  | 'bookmark'
  | 'eye'
  | 'calendar'
  | 'clock'
  | 'star';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type IconVariant = 'outline' | 'solid' | 'mini';

export interface IconConfig {
  name: IconName;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  ariaLabel?: string;
}

export interface IconMapping {
  outline: string;
  solid: string;
  mini: string;
}