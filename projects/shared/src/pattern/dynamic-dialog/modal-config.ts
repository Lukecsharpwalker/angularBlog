export interface ModalConfig<T = unknown> {
  title?: string;
  content?: string;
  image?: string;
  primaryButton?: string;
  secondaryButton?: string;
  data?: T;
}
