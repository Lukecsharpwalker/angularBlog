# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **angular.fun** - a modern Angular 20+ blog application with Supabase backend. The project is currently a monolithic structure in `/src` but is being refactored into a multi-project workspace with micro-frontends and shared libraries.

### Current Architecture

- **Main App**: `/src/app` - Monolithic structure containing both reader and admin functionality
- **Reader**: `/src/app/reader` - Public blog with SSG/SSR capabilities
- **Admin**: `/src/app/admin` - Admin panel with CSR for content management
- **Shared**: `/src/app/shared` - Common components, services, models, and stores

### Target Architecture (Multi-Project Workspace)

- **projects/web**: Public blog with hybrid rendering (SSG for articles, SSR for home)
- **projects/admin**: Pure CSR admin panel for Firebase Hosting
- **projects/code-samples-mfe**: Micro-frontend for code samples via Native Federation
- **projects/shared**: Shared library with UI components, patterns, data-access, and models

## Common Development Commands

### Development

```bash
npm start                    # Start main app (development mode)
npm run start:local          # Start with local Supabase configuration
npm run start:local:docker   # Open Docker for local development
npm run start:local:backend  # Start local Supabase instance
```

### Building

```bash
npm run build                # Build for production
npm run build:stats          # Build with bundle analysis stats
npm run analyze              # Analyze bundle size with webpack-bundle-analyzer
```

### Testing

```bash
npm test                     # Run unit tests with Karma
npm run e2e                  # Run E2E tests with Playwright
npm run e2e:local            # Run E2E tests against local environment
```

### Supabase Management

```bash
npx supabase start           # Start local Supabase
npx supabase stop            # Stop local Supabase
npm run schema:pull          # Pull remote schema from cloud Supabase
npm run db:createSeed        # Create database seed file
npm run db:seed              # Initialize database with seed data
```

### Project-Specific Commands

```bash
ng serve admin               # Serve admin project (when refactored)
ng serve web                 # Serve web project (when refactored)  
ng build shared              # Build shared library
ng serve code-samples-mfe    # Serve code samples micro-frontend
```

## Key Technologies & Stack

- **Frontend**: Angular 20, NgRx Signals, Tailwind CSS, DaisyUI, Quill Editor, Highlight.js
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Functions)
- **Testing**: Playwright for E2E, Karma/Jasmine for unit tests
- **Build**: Angular CLI with esbuild, SSR/SSG capabilities
- **State Management**: NgRx SignalStore throughout all applications

## Code Architecture Patterns

### State Management

- Use NgRx SignalStore for all state management
- Feature-scoped stores in individual feature directories
- Shared stores in `/src/app/shared/stores` -> refactor to `/projects/shared/src/data-access/stores` in new architecture

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

- The legacy monolith remains under `/src` until migration is complete — **do not modify** unless explicitly approved.
- The target workspace lives under `/projects` and `/projects/shared`.

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
- Tailwind/DaisyUI configuration shared where possible; design tokens in `shared`.

See the [architecture.txt](llms/private/architecture.txt) document for authoritative rules and dependency boundaries.

### Styling

- Use Tailwind CSS with DaisyUI components
- Custom color palette: primary (#12372A), secondary (#436850), tertiary (#ADBC9F), quaternary (#FBFADA)
- Monitor CSS bundle size with budget limits in angular.json

### Type Safety

- Strict TypeScript configuration enabled
- Supabase types generated in `/src/app/types/supabase/` -> refactor to `/projects/shared/src/models/supabase/`
- Use proper interfaces for all data models

### Environment Configuration

- `environment.ts` - Production
- `environment.development.ts` - Development
- `environment.local.ts` - Local Supabase instance

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

## Migration Status

The project is currently migrating from monolithic structure to multi-project workspace:

- Current: Single app in `/src`
- Target: Separate projects in `/projects/` with shared libraries
- Architecture guidance available in `/llms/private/architecture.txt`

## LLM Context Files

Always read these files before making refactor proposals or code edits:

- [llms/private/architecture.txt](llms/private/architecture.txt)
- [llms/private/llm-full.txt](llms/private/llm-full.txt)
- [llms/private/app-description.txt](llms/private/app-description.txt)

These documents are authoritative for:

- Workspace and folder structure
- Angular 20 style and coding conventions
- Target apps, rendering modes, and deployment
