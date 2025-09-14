# Shared Library Refactoring Plan

## Executive Summary

Complete restructuring of `projects/shared/` from technical layers to domain-driven architecture according to BOOK principles (llms/public/architecture.md).

## Current State Analysis

### Existing Structure (INCORRECT)
```
projects/shared/src/
├── data-access/          # Technical layer (WRONG)
├── models/               # Mixed domains (WRONG)
├── pattern/              # Correct placement
└── public-api.ts         # Incomplete exports
```

### Architecture Violations Found

1. **Technical Layering Instead of Domain-First**: Current structure uses `data-access/`, `models/` folders instead of domain organization
2. **Missing Core Domain Structure**: No `core/<domain>/` for headless services and stores
3. **Mixed Domain Models**: Models scattered across technical folders instead of grouped by domain
4. **Missing UI Directory**: No `ui/` for pure presentational components
5. **Environment Dependencies**: SupabaseClient imports environment directly (boundary violation)
6. **Unused Code**: Firebase-specific code (query-operators.ts) not used in Supabase app
7. **Conflicting Types**: Generic blog.ts conflicts with Supabase-specific Post model

## Target Architecture (BOOK-Compliant)

```
projects/shared/
├── core/                      # Headless, domain-first (eager)
│   ├── auth/                  # Auth domain
│   │   ├── auth.service.ts    # Auth operations (from data-access)
│   │   ├── auth.store.ts      # Auth state (from data-access)
│   │   ├── auth.models.ts     # Credentials, Session types
│   │   └── public-api.ts      # Domain exports
│   │
│   ├── blog/                  # Blog domain
│   │   ├── blog.models.ts     # Post, Comment, Tag interfaces
│   │   ├── blog.mapper.ts     # DTO transformations
│   │   └── public-api.ts
│   │
│   ├── supabase/              # Infrastructure domain
│   │   ├── supabase.client.ts # Client wrapper
│   │   ├── supabase.models.ts # Database types
│   │   ├── supabase.helpers.ts # Type helpers
│   │   └── public-api.ts
│   │
│   └── utils/                 # Pure functions
│       ├── validators.ts
│       └── public-api.ts
│
├── ui/                        # Presentational components (standalone)
│   └── (empty - no shared UI components yet)
│
├── pattern/                   # Reusable bundles (UI + logic)
│   ├── auth-form/            # Keep as-is
│   ├── dynamic-dialog/       # Keep as-is
│   └── public-api.ts
│
├── models/                    # Domain contracts only
│   ├── auth/                 # Auth interfaces
│   │   └── public-api.ts
│   ├── blog/                 # Blog interfaces
│   │   └── public-api.ts
│   └── public-api.ts
│
└── src/
    └── public-api.ts         # Main barrel export
```

## Migration Steps

### Phase 1: Create Core Domain Structure

1. **Create core/auth/**
   - Move `data-access/auth/auth.store.ts` → `core/auth/auth.store.ts`
   - Move `models/auth/credentials.ts` → `core/auth/auth.models.ts`
   - Create `core/auth/public-api.ts` with proper exports

2. **Create core/blog/**
   - Move blog-related models → `core/blog/blog.models.ts`
   - Remove conflicting `models/blog/blog.ts`
   - Keep `post-fields.ts`, `table-of-contents.ts` as blog models
   - Create `core/blog/public-api.ts`

3. **Create core/supabase/**
   - Move `data-access/clients/supabase.client.ts` → `core/supabase/supabase.client.ts`
   - Move all `models/supabase/*.ts` → `core/supabase/`
   - Fix environment injection (use DI instead of direct import)
   - Create `core/supabase/public-api.ts`

### Phase 2: Clean Models Directory

4. **Restructure models/**
   - Keep only pure interfaces/types
   - Move implementation details to core domains
   - Delete `models/api/` (unused Firebase code)
   - Update all barrel exports

### Phase 3: Verify Pattern Directory

5. **Pattern directory** (already correct)
   - Keep `auth-form/` as-is
   - Keep `dynamic-dialog/` as-is
   - Ensure proper public-api.ts exports

### Phase 4: Update Imports

6. **Update all project imports**
   - Web project: Update 18 import statements
   - Admin project: Update 11 import statements
   - Update paths from `shared/models` → `shared/core/<domain>`
   - Update paths from `shared/data-access` → `shared/core/<domain>`

### Phase 5: Fix Boundary Rules

7. **Update eslint.config.js boundaries**
   ```javascript
   // Add new boundaries for core domains
   { type: 'shared-core-auth', pattern: 'projects/shared/core/auth/**' }
   { type: 'shared-core-blog', pattern: 'projects/shared/core/blog/**' }
   { type: 'shared-core-supabase', pattern: 'projects/shared/core/supabase/**' }
   ```

### Phase 6: Testing & Validation

8. **Run validations**
   - `npm run lint:shared` - Verify no lint errors
   - `npm run lint:web` - Verify web imports
   - `npm run lint:admin` - Verify admin imports
   - `ng build shared` - Ensure library builds
   - `ng build web` - Ensure web app builds
   - `ng build admin` - Ensure admin app builds

## File-by-File Migration Map

| Current Location | New Location | Action |
|-----------------|--------------|---------|
| `data-access/auth/auth.store.ts` | `core/auth/auth.store.ts` | Move & update imports |
| `data-access/clients/supabase.client.ts` | `core/supabase/supabase.client.ts` | Move & fix env injection |
| `data-access/supabase/initialize-supabase.ts` | `core/supabase/initialize-supabase.ts` | Move |
| `models/auth/credentials.ts` | `core/auth/auth.models.ts` | Move & rename |
| `models/blog/blog.ts` | - | DELETE (conflicts with Post) |
| `models/blog/post-fields.ts` | `core/blog/blog.models.ts` | Merge into models file |
| `models/blog/table-of-contents.ts` | `core/blog/blog.models.ts` | Merge into models file |
| `models/supabase/*.ts` | `core/supabase/` | Move all files |
| `models/api/` | - | DELETE entire folder (unused) |
| `pattern/auth-form/` | `pattern/auth-form/` | Keep as-is |
| `pattern/dynamic-dialog/` | `pattern/dynamic-dialog/` | Keep as-is |

## Import Updates Required

### Web Project (18 files)
- Update from `shared/models/supabase` → `shared/core/supabase`
- Update from `shared/data-access/auth` → `shared/core/auth`
- Update from `shared/models/blog` → `shared/core/blog`

### Admin Project (11 files)
- Update from `shared/models/supabase` → `shared/core/supabase`
- Update from `shared/data-access/auth` → `shared/core/auth`
- Update from `shared/models/blog` → `shared/core/blog`

## Success Criteria

- [x] All files organized by domain under `core/<domain>/`
- [x] No technical layer folders (`data-access/`, generic `models/`)
- [x] Each domain has proper `public-api.ts` exports
- [x] Environment dependencies removed from shared library
- [x] All imports updated in consuming projects
- [x] ESLint boundaries properly configured
- [x] All builds pass: `ng build shared`, `ng build web`, `ng build admin`
- [x] All linting passes: `npm run lint`

## Risk Mitigation

1. **Breaking Changes**: All imports will break - must update systematically
2. **Build Failures**: Test builds after each phase
3. **Runtime Errors**: Test auth flows after migration
4. **Type Safety**: Ensure all TypeScript types resolve correctly

## Estimated Effort

- Total files to move/modify: ~35
- Import statements to update: ~29
- Estimated time: 2-3 hours for complete refactoring

## Post-Refactoring Tasks

1. Update documentation to reflect new structure
2. Add architectural decision records (ADRs)
3. Create lint rules to prevent regression
4. Consider adding Nx workspace for better boundaries