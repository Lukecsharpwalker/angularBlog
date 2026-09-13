export type ModalVariant = 'sheet' | 'standard' | 'immersive';

export interface ModalConfig<T = unknown> {
  title?: string;
  ariaLabel?: string;
  content?: string;
  image?: string;
  primaryButton?: string;
  secondaryButton?: string;
  variant: ModalVariant;
  transitionSource?: HTMLElement;
  data?: T;
}
