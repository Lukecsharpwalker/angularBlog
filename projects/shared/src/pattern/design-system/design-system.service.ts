import { Injectable, inject, DOCUMENT } from '@angular/core';
import { signal, computed, effect } from '@angular/core';
import type { Theme } from './design-system.models';

@Injectable({
  providedIn: 'root'
})
export class DesignSystemService {
  private readonly document = inject(DOCUMENT);
  private readonly localStorage = this.document.defaultView?.localStorage;

  private readonly _theme = signal<Theme>('auto');
  private readonly _systemTheme = signal<'light' | 'dark'>('light');

  readonly theme = this._theme.asReadonly();
  readonly systemTheme = this._systemTheme.asReadonly();
  readonly effectiveTheme = computed(() => {
    const theme = this._theme();
    return theme === 'auto' ? this._systemTheme() : theme;
  });

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
    this.setupThemeEffect();
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.localStorage?.setItem('theme', theme);
  }

  toggleTheme(): void {
    const current = this._theme();
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    this.setTheme(next);
  }

  private initializeTheme(): void {
    const stored = this.localStorage?.getItem('theme') as Theme;
    if (stored && ['light', 'dark', 'auto'].includes(stored)) {
      this._theme.set(stored);
    }

    this.updateSystemTheme();
  }

  private setupSystemThemeListener(): void {
    if (this.document.defaultView?.matchMedia) {
      const mediaQuery = this.document.defaultView.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => this.updateSystemTheme());
    }
  }

  private updateSystemTheme(): void {
    if (this.document.defaultView?.matchMedia) {
      const isDark = this.document.defaultView.matchMedia('(prefers-color-scheme: dark)').matches;
      this._systemTheme.set(isDark ? 'dark' : 'light');
    }
  }

  private setupThemeEffect(): void {
    effect(() => {
      const theme = this.effectiveTheme();
      const html = this.document.documentElement;

      html.removeAttribute('data-theme');
      html.classList.remove('light', 'dark');

      if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        html.classList.add('dark');
      } else {
        html.setAttribute('data-theme', 'light');
        html.classList.add('light');
      }
    });
  }
}
