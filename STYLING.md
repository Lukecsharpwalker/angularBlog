# Styling Manual

## Everyday styling

Put Tailwind classes directly in the HTML template:

```html
<div class="flex items-center gap-2 p-4 bg-surface-1 rounded-lg shadow-md">
  <span class="text-ink-2 text-sm">Draft</span>
</div>
```

## Colors

**Brand** (same in every app):

| Name | Value | Example classes |
|---|---|---|
| `primary` | `#12372A` dark green | `bg-primary`, `text-primary`, `border-primary` |
| `secondary` | `#436850` green | `text-secondary`, `from-secondary` |
| `tertiary` | `#ADBC9F` sage | `bg-tertiary/30`, `border-tertiary` |
| `quaternary` | `#FBFADA` cream | `bg-quaternary` |
| `accent` | `#FF6B35` orange | decorative highlights |

**Semantic** (use these instead of gray/white):

| Name | Use for | Example |
|---|---|---|
| `surface` | page background | `bg-surface` |
| `surface-1` | cards, dialogs | `bg-surface-1` |
| `surface-2` | subtle panels | `bg-surface-2` |
| `ink-1` / `ink-2` / `ink-3` | text: strong / normal / muted | `text-ink-2` |
| `ink-inverse` | text on dark fills | `text-ink-inverse` |
| `edge-1` / `edge-2` | borders: light / stronger | `border border-edge-1` |
| `success` `warning` `error` `info` | statuses | `text-error`, `bg-success` |

## Buttons

```html
<button shared-button>Save</button>
<button shared-button variant="secondary">Cancel</button>
<button shared-button variant="tertiary" size="sm">Details</button>
<button shared-button variant="danger">Delete</button>
<button shared-button block>Full width</button>
<a shared-button routerLink="/posts">Browse</a>
```

Import in the component:

```ts
import { SharedButtonComponent } from '@shared/ui/button';
```

## Form inputs

```html
<input class="form-input" placeholder="Enter your email" />
```

## Ready-made utilities

All of these accept variant prefixes (`md:`, `hover:`…):

| Class | What it does |
|---|---|
| `glass-panel` | white glass border + rounded corners; combine with `bg-white/70 backdrop-blur-md` |
| `icon-badge` | centered circle (avatars, icon buttons) — add your size + colors |
| `hover-lift` | grows slightly + shadow on hover |
| `hover-lift-subtle` | floats up on hover |
| `glass-effect-strong` / `glass-effect-light` | frosted panels |
| `glass-card-dialog` / `glass-overlay-dialog` | dialog panel / dimmed backdrop |
| `grain-overlay` | subtle dot texture |
| `animate-fade-in` / `animate-scale-in` / `animate-slide-down` | entry animations |

## Recipes

**Change a brand color** — edit the hex in
`projects/shared/src/styles/theme.css`. Every app updates.

**Give one app a different background** — in that app's `src/styles.css`:

```css
:root {
  --color-surface: #f6f1e7;
}
```

**Add a new color or animation** — add a line to the `@theme` block in
`theme.css`:

```css
--color-highlight: #FFD166;
```

Now `bg-highlight`, `text-highlight` etc. exist everywhere.

**Create a reusable utility** — when the same combo of styles appears in 3+
places, add it to `projects/shared/src/styles/utilities.css`:

```css
@utility skeleton-bar {
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border-radius: 0.25rem;
}
```

**Write CSS in the component's `.css` file** only for things classes can't
reach: third-party markup (Quill's `.ql-*`), scrollbars, keyframe-heavy
states. Use tokens there: `var(--color-primary)`,
`color-mix(in srgb, var(--color-primary) 10%, transparent)`.

## Tips

- `border` alone renders in the text color — always pair it:
  `border border-edge-1`.
- Prefer scale values over arbitrary ones: `p-4`, not `p-[17px]`. If you need
  a magic value, it probably belongs in `theme.css` or the component's `.css`.
- `.ts` files never contain styles or class strings.

## File map

```
projects/shared/src/styles/theme.css      colors, animations (the design tokens)
projects/shared/src/styles/utilities.css  shared utility classes
projects/shared/src/styles/base.css       article typography (h1–h4)
projects/shared/src/ui/button/            the shared button
projects/<app>/src/styles.css             app entry + per-app overrides
```
