# Should Stores Be in Shared Library?

**Status**: ARCHITECTURAL DECISION NEEDED
**Generated**: 2026-03-04

---

## Current Situation

You have **1 store** in your shared library:

```
projects/shared/src/
└── core/
    └── auth/
        └── auth.store.ts        ← Global auth state store
```

**Used by**:
- ✅ `projects/web` (2 components)
- ✅ `projects/admin` (2 components)

**Configuration**: `providedIn: 'root'` (global singleton)

---

## The Debate: Should Stores Be in Shared Libraries?

### ❌ **NO** - Angular Material Approach (Recommended)

**What Angular Material Does**:
- ❌ Does NOT export stores
- ❌ Does NOT manage application state
- ✅ Exports components, services, and utilities
- ✅ Apps manage their own state

**Example**:
```typescript
// Angular Material provides services, not stores
import { MatDialog } from '@angular/material/dialog';  // ✅ Service
import { MatSnackBar } from '@angular/material/snack-bar';  // ✅ Service

// NOT:
import { MatDialogStore } from '@angular/material/dialog';  // ❌ Doesn't exist
```

---

### ⚠️ **MAYBE** - Infrastructure Exception

**Special Case**: Authentication might be an exception because:
- ✅ Auth is **infrastructure**, not a feature
- ✅ **Truly shared** across all apps (web, admin)
- ✅ Same business logic everywhere
- ✅ Avoids duplication

**But consider**:
- ❌ Creates tight coupling between library and apps
- ❌ Makes library less reusable
- ❌ State management is typically app-specific
- ❌ What if different apps need different auth flows?

---

## How Angular Material Handles Auth

Angular Material **does NOT** provide auth stores. Instead:

```typescript
// Angular provides services, apps manage state
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post('/auth/login', { email, password });
  }

  logout() {
    return this.http.post('/auth/logout', {});
  }
}
```

**Then apps create their own stores**:
```typescript
// In each app (web/admin)
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod(pipe(
      switchMap(creds => authService.login(creds.email, creds.password))
    ))
  }))
);
```

---

## Your AuthStore Analysis

### What It Does:

```typescript
// projects/shared/src/core/auth/auth.store.ts
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState({
    session: null,
    profile: null,
    loading: false,
    error: null
  }),
  withMethods({
    loginWithPassword,
    loginWithEmailOtp,
    loginWithProvider,
    signup,
    logout
  })
);
```

**220 lines** of authentication logic including:
- Session management
- Profile fetching
- Multiple login methods (password, OTP, OAuth)
- Error handling
- Loading states

---

## The Problem with Current Approach

### Issue #1: Library Dictates State Shape

```typescript
// Shared library defines the state structure
interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}
```

**What if**:
- ❌ Admin needs extra fields (roles, permissions)?
- ❌ Web doesn't need profile?
- ❌ Different apps have different requirements?

**Solution**: Let each app define its own state.

---

### Issue #2: Tight Coupling

```typescript
// Every app MUST use this exact store
import { AuthStore } from 'shared';

// Can't customize without modifying shared library
```

**What if**:
- ❌ Admin wants different login methods?
- ❌ Web wants to add remember-me checkbox?
- ❌ Future app needs different auth flow?

**Solution**: Provide a service, let apps create stores.

---

### Issue #3: Less Reusable

If you wanted to publish this library to npm:
- ❌ Other teams might not want your auth state structure
- ❌ Forces NgRx Signals on consumers
- ❌ Can't use library without accepting the store

**Solution**: Separate concerns - library provides services, apps manage state.

---

## Recommended Refactor

### Option A: Convert Store → Service (Recommended)

**Move store logic to service**:

```typescript
// projects/shared/src/core/auth/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseClient);

  getCurrentSession() {
    return from(this.supabase.getCurrentSession());
  }

  loginWithPassword(email: string, password: string) {
    return from(this.supabase.signInWithPassword(email, password));
  }

  loginWithProvider(provider: Provider) {
    return from(this.supabase.signInWithProvider(provider));
  }

  logout() {
    return from(this.supabase.signOut());
  }

  // Auth state change listener
  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.supabase.authChanges((_, session) => callback(session));
  }
}
```

**Apps create their own stores**:

```typescript
// projects/web/src/app/core/auth/auth.store.ts
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod(pipe(
      switchMap(({ email, password }) => authService.loginWithPassword(email, password)),
      tap(res => patchState(store, { session: res.data.session }))
    ))
  }))
);
```

**Benefits**:
- ✅ Shared library provides **capabilities** (service)
- ✅ Apps define **state shape** (store)
- ✅ Each app can customize
- ✅ Library is more reusable
- ✅ Follows Angular Material pattern

---

### Option B: Keep Store, Add Configuration (Compromise)

Make the store more flexible:

```typescript
// projects/shared/src/core/auth/auth.store.config.ts
export interface AuthStoreConfig<TProfile = Profile> {
  profileFetcher?: (userId: string) => Promise<TProfile>;
  errorHandler?: (error: unknown) => string;
}

// Allow apps to configure the store
export function createAuthStore<TProfile = Profile>(config?: AuthStoreConfig<TProfile>) {
  return signalStore(/* ... */);
}
```

**Benefits**:
- ✅ More flexible
- ⚠️ Still couples apps to store structure
- ⚠️ More complex

---

### Option C: Keep As-Is (Not Recommended)

**Arguments FOR**:
- ✅ Works currently
- ✅ No refactoring needed
- ✅ Avoids duplication

**Arguments AGAINST**:
- ❌ Violates Angular Material pattern
- ❌ Less reusable
- ❌ Tight coupling
- ❌ Hard to extend

---

## Comparison Table

| Aspect | Current (Store in Shared) | Option A (Service in Shared) | Angular Material |
|--------|--------------------------|------------------------------|------------------|
| **State Management** | Library dictates | App controls | App controls |
| **Flexibility** | Low | High | High |
| **Reusability** | Limited | High | High |
| **Coupling** | Tight | Loose | Loose |
| **Complexity** | Medium | Low | Low |
| **Follows Patterns** | ❌ No | ✅ Yes | ✅ Yes |

---

## Real-World Examples

### ✅ What Libraries Export:

**Angular Material**:
```typescript
import { MatDialog } from '@angular/material/dialog';  // Service
```

**RxJS**:
```typescript
import { BehaviorSubject } from 'rxjs';  // Primitive
```

**NgRx**:
```typescript
import { createFeature } from '@ngrx/store';  // Factory function
```

### ❌ What Libraries DON'T Export:

- ❌ Feature stores
- ❌ Application state
- ❌ Global state management

---

## Migration Path (Option A)

### Phase 1: Create AuthService

```typescript
// projects/shared/src/core/auth/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseClient);

  getCurrentSession(): Observable<Session | null> {
    return from(this.supabase.getCurrentSession());
  }

  loginWithPassword(email: string, password: string): Observable<AuthResponse> {
    return from(this.supabase.signInWithPassword(email, password));
  }

  // ... other methods
}
```

**Export from public-api**:
```typescript
// projects/shared/src/core/auth/public-api.ts
export * from './auth.service';
export * from './auth.models';
// export * from './auth.store';  ← Remove this later
```

---

### Phase 2: Create App-Specific Stores

**Web**:
```typescript
// projects/web/src/app/core/auth/web-auth.store.ts
export const WebAuthStore = signalStore(
  { providedIn: 'root' },
  withState({ /* web-specific state */ }),
  withMethods((store, authService = inject(AuthService)) => ({
    // Use AuthService from shared
    login: rxMethod(pipe(
      switchMap(creds => authService.loginWithPassword(creds.email, creds.password))
    ))
  }))
);
```

**Admin**:
```typescript
// projects/admin/src/app/core/auth/admin-auth.store.ts
export const AdminAuthStore = signalStore(
  { providedIn: 'root' },
  withState({ /* admin-specific state */ }),
  withMethods((store, authService = inject(AuthService)) => ({
    // Use AuthService from shared
    login: rxMethod(pipe(
      switchMap(creds => authService.loginWithPassword(creds.email, creds.password))
    ))
  }))
);
```

---

### Phase 3: Update Components

**Before**:
```typescript
// Uses shared store
import { AuthStore } from 'shared';

export class LoginComponent {
  authStore = inject(AuthStore);
}
```

**After**:
```typescript
// Uses app-specific store
import { WebAuthStore } from '../../core/auth/web-auth.store';

export class LoginComponent {
  authStore = inject(WebAuthStore);
}
```

---

### Phase 4: Remove Shared Store

Once all apps are migrated:

```bash
rm projects/shared/src/core/auth/auth.store.ts
```

Update exports:
```typescript
// projects/shared/src/core/auth/public-api.ts
export * from './auth.service';  // ✅ Keep
export * from './auth.models';   // ✅ Keep
// Removed: auth.store            ✅ Deleted
```

---

## My Recommendation: **Option A** (Service Approach)

### Why?

1. **Follows Angular Material pattern** - Services, not stores
2. **More flexible** - Apps control their state
3. **Better separation of concerns** - Library provides capabilities, apps manage state
4. **More reusable** - Library doesn't force state structure
5. **Easier to extend** - Each app can customize

### When to Keep Stores in Shared?

**ONLY if**:
- ✅ Library is private (not published)
- ✅ All consuming apps need IDENTICAL state
- ✅ State logic is truly shared (not app-specific)
- ✅ You're okay with tight coupling

**Your case**:
- ⚠️ Private library (yes)
- ❌ Apps might diverge (web public, admin has roles)
- ⚠️ Auth logic is shared (yes, but state might not be)
- ❌ Better to keep loose coupling

---

## Summary

### Current State:
```typescript
// Shared library exports store
export const AuthStore = signalStore(/* 220 lines */);
```

### Recommended State:
```typescript
// Shared library exports service
@Injectable()
export class AuthService {
  login() { /* ... */ }
  logout() { /* ... */ }
}

// Apps create their own stores
export const WebAuthStore = signalStore(
  withMethods((store, authService = inject(AuthService)) => ({
    // Use shared service
  }))
);
```

---

## Decision Matrix

| Criteria | Keep Store | Extract Service |
|----------|-----------|-----------------|
| Follows Angular patterns | ❌ | ✅ |
| Reusable library | ❌ | ✅ |
| App flexibility | ❌ | ✅ |
| Current works | ✅ | ⚠️ Needs refactor |
| Effort required | ✅ Low | ⚠️ Medium |

**Recommendation**: **Extract to Service** (Option A)

---

## Next Steps

1. ✅ Review this analysis
2. ⏸️ Decide approach (A, B, or C)
3. ⏸️ Create AuthService if Option A
4. ⏸️ Create app-specific stores
5. ⏸️ Migrate components
6. ⏸️ Remove shared store

**Estimated effort**: 2-3 hours for full migration

---

**TL;DR**: Shared libraries should provide **services** (capabilities), not **stores** (state). Let apps manage their own state using services from the shared library. This is the Angular Material pattern.
