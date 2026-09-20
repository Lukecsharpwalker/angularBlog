# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MOST IMPORTANT: Always read the LLM context files in `/llms/` before making any code changes or refactor proposals.

### Essential LLM Context Files

- **`/llms/public/app-description.txt`** - Complete application overview, architecture goals, and deployment strategy
- **`/llms/public/architecture.md`** - Authoritative enterprise architecture rules and folder structure
- **`/llms/public/llm-full.txt`** - Comprehensive Angular development guidelines and best practices
- **`/llms/public/styling.txt`** - Authoritative styling architecture (Tailwind v4, design tokens, per-app theming)

These files contain the definitive project specifications and must be consulted before any architectural decisions or code modifications.

## MOST IMPORTANT: AGENTS MUST NOT ADD COMMENTS TO CODE

This rule applies to comments added by AI agents. Agents must not add new comments, explanations, or documentation inside code files. This includes:

- `// single line comments`
- `/* block comments */`
- `/** JSDoc comments */`
- `<!-- HTML comments -->`
- `# Any other comment syntax`

This is not a repository-wide ban on comments. Existing comments, including user-written comments and comments copied from external code, are allowed. Preserve them unless the user requests a change. During review, do not report the presence of comments as a violation of this rule or demand their removal. A staged or unstaged diff does not establish who authored a comment.

Agents should put their explanations in review messages or PR discussions and use clear naming and structure in code.

## MOST IMPORTANT: CLASS MEMBER ORDERING - EVERY FILE YOU TOUCH

**Two axes at once.** Applying only one of them fails either lint or review.

**Outer axis - visibility.** Enforced by `@typescript-eslint/member-ordering` in `eslint.config.js`:

```
public -> protected -> private
```

**Inner axis - member kind.** Applies _inside_ each visibility block:

```
inputs -> outputs -> queries (viewChild / contentChild) -> injects -> state (signal / computed)
```

Separate each kind group with one blank line. Fields first, then constructor, then methods.

```ts
export class NavbarComponent {
  protected readonly userName = inject(ProfileStore).userName;

  protected readonly openPanel = signal<NavbarPanel | null>(null);
  protected readonly searchQuery = signal('');

  protected readonly menuOpen = computed(() => this.openPanel() === 'menu');
  protected readonly overlayOpen = computed(() => this.openPanel() !== null);

  private readonly menuToggleButton = viewChild<ElementRef<HTMLButtonElement>>('menuToggleButton');
  private readonly searchToggleButton =
    viewChild<ElementRef<HTMLButtonElement>>('searchToggleButton');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly authService = inject(AuthService);
}
```

This applies to **every file you touch**, not only new ones. A field you add lands in its correct group immediately - never appended wherever it happens to be needed.

## Project Overview

This is **angular.fun** - a modern Angular 20+ blog application with Supabase backend, built as a multi-project workspace with micro-frontends and shared libraries.

### Architecture

- **projects/web**: Public blog with hybrid rendering (SSG for articles, SSR for home)
- **projects/admin**: Pure CSR admin panel for Firebase Hosting
- **projects/code-samples-mfe**: Micro-frontend for code samples via Native Federation
- **projects/shared**: Shared library with UI components, patterns, data-access, and models

## Common Development Commands

### Development

```bash
npm run start:web             # Web on port 4200, cloud Supabase
npm run start:admin           # Admin on port 4201, cloud Supabase
npm run start:web:local-env   # Web on port 4200, local Supabase
npm run start:admin:local-env # Admin on port 4201, local Supabase
npm run start:local:backend   # Start local Supabase instance
npm run watch:web             # Rebuild web on every change
npm run watch:admin           # Rebuild admin on every change
```

### Building

```bash
npm run build                # Web, production
npm run build:admin          # Admin
npm run build:all            # shared, web, admin, code-samples-mfe
npm run build:stats          # Web plus dist/web/stats.json (esbuild metafile)
npm run serve:ssr:web        # Run the built web SSR server
```

### Testing

```bash
npm run test:web             # Unit tests for web (Karma)
npm run test:admin           # Unit tests for admin
npm run test:shared          # Unit tests for shared
npm run test:mfe             # Unit tests for code-samples-mfe
npm run test:all             # Unit tests for all four projects
npm run e2e                  # All Playwright projects
npm run e2e:web              # Playwright, web project
npm run e2e:admin            # Playwright, admin project
```

### Supabase Management

```bash
npx supabase start           # Start local Supabase
npx supabase stop            # Stop local Supabase
npx supabase db reset        # Recreate the local database: migrations and seed/seed.sql
npm run schema:pull          # Pull remote schema from cloud Supabase
npm run db:createSeed        # Create database seed file
```

### Project-Specific Commands

```bash
ng build shared              # Build shared library
ng serve code-samples-mfe    # Serve code samples micro-frontend
```

## Key Technologies & Stack

- **Frontend**: Angular 20, NgRx Signals, Tailwind CSS v4, Quill Editor, Highlight.js
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Functions)
- **Testing**: Playwright for E2E, Karma/Jasmine for unit tests
- **Build**: Angular CLI with esbuild, SSR/SSG capabilities
- **State Management**: NgRx SignalStore throughout all applications

## Code Architecture Patterns

### State Management

- Use NgRx SignalStore for all state management
- Feature-scoped stores in individual feature directories
- Shared stores in `projects/shared/src/core`

### Component Structure

- Standalone components using Angular's modern APIs
- Feature-based organization with lazy-loaded routes
- UI components are pure and stateless (inputs/outputs only)
- Business logic encapsulated in services and stores

### Data Access

- **Public/Reader**: Uses PostgREST endpoints for SSG/SSR compatibility
- **Admin**: Uses `@supabase/supabase-js` browser client
- **Authentication**: Supabase Auth with role-based access control
- **Storage**: Supabase Storage CDN for images and assets

### Routing

- Lazy-loaded feature modules
- Route-level providers for feature isolation
- Functional guards for authentication (`authAdminGuard`)

## Development Guidelines

### File Organization

- The workspace lives under `/projects` and `/projects/shared`.

**Apps**

- `projects/web` — feature-first, standalone, lazy:
  - `app/` (bootstrap, root routes)
  - `features/<feature-name>/` (routes, components, stores, services)
  - `layout/` (shell, navigation, footer)
  - `core/` (app-level providers: http, interceptors, guards)
- `projects/admin` — CSR-only, same structure as `web`.
- `projects/code-samples-mfe` — remote MFE, only required features and mfe routing.

**Shared library**

- `projects/shared/`
  - `ui/` (pure presentational components; no business logic)
  - `pattern/` (composable building blocks, form controls, table abstractions)
  - `data-access/` (clients, repositories, query functions; PostgREST for web SSR/SSG, supabase-js for admin)
  - `models/` (types, DTOs, schema definitions)
  - `utils/` (pure functions, pipes, directives)

**General rules**

- Standalone + lazy everywhere; **no cross-feature TS imports**.
- Promote reusable logic “upwards” (from feature → pattern/ui/data-access).
- Keep guards/interceptors/providers at route-level or in `core/` per app.
- Design tokens live in `projects/shared/src/styles/theme.css`; see `llms/public/styling.txt`.

See the [architecture.md](llms/public/architecture.md) document for authoritative rules and dependency boundaries.

### Styling

- Tailwind CSS v4, CSS-first configuration — no tailwind.config.js; the `@theme` block in `projects/shared/src/styles/theme.css` is the single source of truth
- Brand palette: primary (#12372A), secondary (#436850), tertiary (#ADBC9F), quaternary (#FBFADA) — identical in all apps; per-app looks come from overriding semantic variables (`--color-surface` etc.) in each app's `src/styles.css`
- No `@apply` outside app entry stylesheets; full rules in `llms/public/styling.txt`
- Monitor CSS bundle size with budget limits in angular.json

### Type Safety

- Strict TypeScript configuration enabled
- Supabase types generated in `projects/shared/src/core/supabase/`
- Use proper interfaces for all data models

### Code Style

- Agents must not add new comments or explanatory text to code files.
- Use clear naming and structure for agent-written code.
- Existing comments are allowed; do not flag or remove them merely because they are comments.

### Environment Configuration

- `environments/environment.ts` - Production
- `environments/environment.development.ts` - Development
- `environments/environment.local.ts` - Local Supabase instance

## Supabase Integration

### Supabase Configuration

- projects/web uses PostgREST for SSG/SSR compatibility
- rest uses `@supabase/supabase-js` for browser client

### Database Schema

- Posts, Comments, Tags, PostTags, Profiles tables
- Row Level Security (RLS) policies for data protection
- Migrations managed in `/supabase/migrations/`

### Authentication

- Email/password authentication
- Role-based access (admin, user roles)
- Protected admin routes with functional guards

### Local Development

- Use Docker for local Supabase instance
- Access Supabase Studio at http://localhost:54323
- Seed data available via scripts in `/scripts/`

## Testing Strategy

### E2E Tests (Playwright)

- Tests in `/e2e/` directory
- Configured for multiple browsers (Chromium, Firefox, WebKit)
- Helper utilities in `/e2e/helpers/`
- Local and CI configurations available

### Unit Tests

- Colocated spec files with components/services
- Karma + Jasmine test runner -> refactor to use Vitest in the future
- Focus on business logic and component behavior

## Build & Deployment

### Bundle Optimization

- Lazy loading for all features
- Bundle analysis with webpack-bundle-analyzer
- Performance budgets enforced in angular.json
- Tree-shaking enabled for optimal bundle sizes

### Target Deployments

- **Web**: Google Cloud Run (SSG/SSR)
- **Admin**: Firebase Hosting (CSR)
- **Code Samples MFE**: Firebase Hosting (MFE)
- **Assets**: Supabase Storage CDN
