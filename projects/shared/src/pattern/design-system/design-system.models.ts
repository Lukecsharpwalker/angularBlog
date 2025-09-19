export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeState {
  theme: Theme;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
}

export interface ThemeConfig {
  storageKey?: string;
  defaultTheme?: Theme;
  enableSystemThemeDetection?: boolean;
}
