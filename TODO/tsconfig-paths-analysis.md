# TypeScript Path Aliases Analysis

**Status**: BUILD FAILURE - Missing Path Mappings
**Generated**: 2026-03-04

---

## Current Problem

**Build Errors:**
```
✘ Could not resolve "@shared/pattern/dynamic-dialog"
✘ Could not resolve "@shared/pattern/auth-form"
✘ Could not resolve "@shared/pattern/icon-system"
✘ Could not resolve "shared"
```

**Root Cause:** Apps are importing from deep paths, but tsconfig.json only maps root paths.

---

## Current tsconfig.json Paths

```json
{
  "paths": {
    "@shared/core": ["projects/shared/src/core/index"],
    "@shared/pattern": ["projects/shared/src/pattern/index"],
    "@shared/utils": ["projects/shared/src/utils/index"]
  }
}
```

**Problem:** Only maps `@shared/pattern`, not `@shared/pattern/dynamic-dialog`.

---

## Actual Imports Used in Apps

### Web Project (10 files):
```typescript
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { AuthFormComponent } from '@shared/pattern/auth-form';
import { IconComponent } from '@shared/pattern/icon-system';
import { Tag } from '@shared/core/supabase';
import { Post } from '@shared/core/supabase';
import { Comment } from '@shared/core/supabase';
import { SupabaseClient } from '@shared/core/supabase';
```

### Admin Project (2 files):
```typescript
import { AuthFormComponent } from '@shared/pattern/auth-form';
import { IconComponent } from '@shared/pattern/icon-system';
import { AuthStore } from 'shared';  // Also uses root import!
```

---

## Available Barrel Files

```
projects/shared/src/
├── core/
│   ├── index.ts
│   ├── public-api.ts
│   ├── auth/
│   │   ├── index.ts
│   │   └── public-api.ts
│   ├── blog/
│   │   ├── index.ts
│   │   └── public-api.ts
│   └── supabase/
│       ├── index.ts
│       └── public-api.ts
├── pattern/
│   ├── index.ts
│   ├── public-api.ts
│   ├── auth-form/
│   │   ├── index.ts
│   │   └── public-api.ts
│   ├── dynamic-dialog/
│   │   ├── index.ts
│   │   └── public-api.ts
│   └── icon-system/
│       ├── index.ts
│       └── public-api.ts
└── utils/
    ├── index.ts
    └── public-api.ts
```

---

## How Angular Material Handles This

### Angular Material's tsconfig.json:

```json
{
  "paths": {
    "@angular/material": ["./src/material/public-api.ts"],
    "@angular/material/*": ["./src/material/*/index.ts"]
  }
}
```

**Usage:**
```typescript
// Primary entry (everything)
import { MatButtonModule } from '@angular/material';

// Secondary entry (granular)
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
```

**Key Pattern:** Uses wildcard `/*` to map all subdirectories.

---

## Solution Options

### Option A: Wildcard Pattern (Recommended - Angular Material Style)

```json
{
  "paths": {
    "shared": ["./projects/shared/src/public-api"],
    "@shared/core": ["projects/shared/src/core/index"],
    "@shared/core/*": ["projects/shared/src/core/*/index"],
    "@shared/pattern": ["projects/shared/src/pattern/index"],
    "@shared/pattern/*": ["projects/shared/src/pattern/*/index"],
    "@shared/utils": ["projects/shared/src/utils/index"]
  }
}
```

**Enables:**
```typescript
// Root
import { AuthStore } from 'shared';

// Domain root
import { AuthStore, Post } from '@shared/core';

// Granular (subdirectory)
import { AuthStore } from '@shared/core/auth';
import { Post } from '@shared/core/supabase';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { IconComponent } from '@shared/pattern/icon-system';
```

**Benefits:**
- ✅ Supports all current imports
- ✅ Flexible (auto-discovers new subdirectories)
- ✅ Matches Angular Material pattern
- ✅ Tree-shaking friendly (granular imports)

**Drawbacks:**
- ⚠️ Slightly more permissive (allows any subdirectory)

---

### Option B: Explicit Paths (More Restrictive)

```json
{
  "paths": {
    "shared": ["./projects/shared/src/public-api"],
    "@shared/core": ["projects/shared/src/core/index"],
    "@shared/core/auth": ["projects/shared/src/core/auth/index"],
    "@shared/core/blog": ["projects/shared/src/core/blog/index"],
    "@shared/core/supabase": ["projects/shared/src/core/supabase/index"],
    "@shared/pattern": ["projects/shared/src/pattern/index"],
    "@shared/pattern/auth-form": ["projects/shared/src/pattern/auth-form/index"],
    "@shared/pattern/dynamic-dialog": ["projects/shared/src/pattern/dynamic-dialog/index"],
    "@shared/pattern/icon-system": ["projects/shared/src/pattern/icon-system/index"],
    "@shared/utils": ["projects/shared/src/utils/index"]
  }
}
```

**Benefits:**
- ✅ Explicit (only allows defined paths)
- ✅ Self-documenting (shows all available imports)
- ✅ More restrictive (prevents accidental deep imports)

**Drawbacks:**
- ❌ Must update when adding new subdirectories
- ❌ More verbose (10 paths vs 6)
- ❌ Not how Angular Material does it

---

### Option C: Remove Scope, Use Wildcard (Simpler)

```json
{
  "paths": {
    "shared": ["./projects/shared/src/public-api"],
    "shared/*": ["projects/shared/src/*/index"],
    "shared/*/*": ["projects/shared/src/*/*/index"]
  }
}
```

**Enables:**
```typescript
import { AuthStore } from 'shared';
import { DynamicDialogService } from 'shared/pattern/dynamic-dialog';
import { Post } from 'shared/core/supabase';
```

**Benefits:**
- ✅ Simplest configuration (3 paths)
- ✅ Auto-discovers all subdirectories
- ✅ Consistent naming (all use `shared` prefix)

**Drawbacks:**
- ❌ Less granular (can't import from domain root like `shared/core`)
- ⚠️ Different style than current `@shared/` scope

---

## Comparison Table

| Feature | Option A (Wildcard) | Option B (Explicit) | Option C (No Scope) |
|---------|---------------------|---------------------|---------------------|
| **Paths Count** | 6 | 10 | 3 |
| **Supports Current Imports** | ✅ Yes | ✅ Yes | ⚠️ Needs refactor |
| **Auto-Discovery** | ✅ Yes | ❌ No | ✅ Yes |
| **Follows Angular Material** | ✅ Yes | ⚠️ Partial | ❌ No |
| **Maintenance** | 🟢 Low | 🔴 High | 🟢 Low |
| **Explicitness** | ⚠️ Medium | ✅ High | 🟡 Low |
| **Import Style** | `@shared/pattern/*` | `@shared/pattern/*` | `shared/pattern/*` |

---

## Recommended Solution: **Option A (Wildcard Pattern)**

### Why?

1. **Matches Angular Material** - Industry standard approach
2. **Supports all current imports** - No refactoring needed
3. **Auto-discovery** - Adding new components doesn't require tsconfig changes
4. **Balanced** - Explicit enough for domain roots, flexible for subdirectories
5. **Tree-shaking friendly** - Granular imports enable better optimization

### Implementation

**Add to tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "shared": ["./projects/shared/src/public-api"],
      "@shared/core": ["projects/shared/src/core/index"],
      "@shared/core/*": ["projects/shared/src/core/*/index"],
      "@shared/pattern": ["projects/shared/src/pattern/index"],
      "@shared/pattern/*": ["projects/shared/src/pattern/*/index"],
      "@shared/utils": ["projects/shared/src/utils/index"]
    }
  }
}
```

**Supported Import Patterns:**
```typescript
// ✅ Root entry point (everything)
import { AuthStore, DynamicDialogService, IconComponent } from 'shared';

// ✅ Domain root (all from core)
import { AuthStore, Post, Comment, Tag } from '@shared/core';

// ✅ Subdomain (specific area)
import { AuthStore, Credentials } from '@shared/core/auth';
import { Post, Tag } from '@shared/core/supabase';

// ✅ Component-level (most granular)
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { AuthFormComponent } from '@shared/pattern/auth-form';
import { IconComponent } from '@shared/pattern/icon-system';
```

---

## Migration Impact

**Files to Update:** 0 (supports current imports)

**Build Changes:**
- ✅ `ng build shared` - Already works
- ✅ `ng build web` - Will work after adding wildcards
- ✅ `ng build admin` - Will work after adding wildcards

**Risk:** 🟢 LOW - No code changes needed, only tsconfig

---

## Alternative: Fix Missing `shared` Path

I also noticed admin uses:
```typescript
import { AuthStore } from 'shared';
```

But `tsconfig.json` doesn't have a `"shared"` path! It needs to be added:

```json
{
  "paths": {
    "shared": ["./projects/shared/src/public-api"],  // ← ADD THIS
    "@shared/core": ["projects/shared/src/core/index"],
    // ... rest
  }
}
```

---

## Complete Recommended tsconfig.json Paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "shared": ["./projects/shared/src/public-api"],
      "@shared/core": ["projects/shared/src/core/index"],
      "@shared/core/*": ["projects/shared/src/core/*/index"],
      "@shared/pattern": ["projects/shared/src/pattern/index"],
      "@shared/pattern/*": ["projects/shared/src/pattern/*/index"],
      "@shared/utils": ["projects/shared/src/utils/index"]
    }
  }
}
```

**Changes from current:**
1. ✅ Added `"shared"` for root imports
2. ✅ Added `"@shared/core/*"` wildcard for supabase, auth, blog
3. ✅ Added `"@shared/pattern/*"` wildcard for dynamic-dialog, auth-form, icon-system

---

## Next Steps

**Awaiting Approval:**
1. ✅ Review this analysis
2. ⏸️ Approve Option A (recommended) or choose alternative
3. ⏸️ Update tsconfig.json
4. ⏸️ Verify builds: `ng build shared && ng build web && ng build admin`

**Estimated Effort:** 5 minutes

---

**TL;DR:** Current paths missing `shared` root and wildcards for subdirectories. Add 3 lines to tsconfig.json to support all current imports (no code changes needed).
