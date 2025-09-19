import { Component, inject } from '@angular/core';
import { DesignSystemService } from './design-system.service';

@Component({
  selector: 'design-tokens-demo',
  standalone: true,
  template: `
    <div class="design-tokens-demo token-p-lg token-rounded-lg token-bg-surface-primary token-shadow-md">
      <div class="header token-p-md">
        <h2 class="token-text-primary text-token-2xl font-token-bold">Design Tokens Demo</h2>
        <button
          (click)="toggleTheme()"
          class="btn btn--primary token-rounded-md">
          Theme: {{ theme() }} → {{ getNextTheme() }}
        </button>
      </div>

      <div class="color-demo token-p-md">
        <h3 class="token-text-secondary text-token-lg font-token-semibold">Colors</h3>
        <div class="color-grid">
          <div class="color-item token-bg-primary">Primary</div>
          <div class="color-item token-bg-secondary">Secondary</div>
          <div class="color-item token-bg-tertiary">Tertiary</div>
          <div class="color-item token-bg-quaternary">Quaternary</div>
          <div class="color-item token-bg-accent-neon">Accent Neon</div>
          <div class="color-item token-bg-accent-purple">Accent Purple</div>
        </div>
      </div>

      <div class="spacing-demo token-p-md">
        <h3 class="token-text-secondary text-token-lg font-token-semibold">Spacing</h3>
        <div class="spacing-examples">
          <div class="spacing-item p-token-xs token-bg-surface-secondary token-rounded">XS Padding</div>
          <div class="spacing-item p-token-sm token-bg-surface-secondary token-rounded">SM Padding</div>
          <div class="spacing-item p-token-md token-bg-surface-secondary token-rounded">MD Padding</div>
          <div class="spacing-item p-token-lg token-bg-surface-secondary token-rounded">LG Padding</div>
        </div>
      </div>

      <div class="shadow-demo token-p-md">
        <h3 class="token-text-secondary text-token-lg font-token-semibold">Shadows</h3>
        <div class="shadow-examples">
          <div class="shadow-item token-p-md token-bg-surface-primary token-rounded-md shadow-token-sm">Small</div>
          <div class="shadow-item token-p-md token-bg-surface-primary token-rounded-md shadow-token">Base</div>
          <div class="shadow-item token-p-md token-bg-surface-primary token-rounded-md shadow-token-md">Medium</div>
          <div class="shadow-item token-p-md token-bg-surface-primary token-rounded-md shadow-token-lg">Large</div>
        </div>
      </div>

      <div class="animation-demo token-p-md">
        <h3 class="token-text-secondary text-token-lg font-token-semibold">Animations</h3>
        <div class="animation-examples">
          <button class="btn btn--secondary token-hover-lift">Hover Lift Effect</button>
          <div class="token-glass-effect token-p-md token-rounded-lg">Glass Effect</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .design-tokens-demo {
      max-width: 800px;
      margin: var(--spacing-md) auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: var(--border-width-1) solid var(--color-border-primary);
      margin-bottom: var(--spacing-md);
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--spacing-sm);
      margin-top: var(--spacing-sm);
    }

    .color-item {
      padding: var(--spacing-md);
      border-radius: var(--border-radius-md);
      text-align: center;
      color: var(--color-text-inverse);
      font-weight: var(--font-weight-medium);
      transition: transform var(--duration-fast) var(--easing-smooth);
    }

    .color-item:hover {
      transform: var(--transform-scale-105);
    }

    .spacing-examples {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-sm);
      flex-wrap: wrap;
    }

    .spacing-item {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);
    }

    .shadow-examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--spacing-md);
      margin-top: var(--spacing-sm);
    }

    .shadow-item {
      text-align: center;
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);
    }

    .animation-examples {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-sm);
      align-items: center;
      flex-wrap: wrap;
    }

    .animation-examples .token-glass-effect {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);
    }
  `]
})
export class DesignTokensDemoComponent {
  private readonly designSystem = inject(DesignSystemService);

  readonly theme = this.designSystem.theme;

  toggleTheme(): void {
    this.designSystem.toggleTheme();
  }

  getNextTheme(): string {
    const current = this.theme();
    return current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
  }
}
