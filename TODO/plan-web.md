# Refactoring Plan for projects/web

## Executive Summary
Refactor projects/web to a clean, maintainable Angular 20 codebase by standardizing access modifiers, moving business logic into services, rationalizing stores and folder structure, and applying Angular 20 best practices with minimal risk and no over-engineering.

## Current State Analysis

### Architecture Overview
- **Structure**: Feature-based organization with lazy loading
- **State Management**: NgRx SignalStore per feature
- **Components**: Mix of smart and presentational components
- **Services**: Limited service layer, business logic mixed in components
- **Access Modifiers**: Inconsistent usage of public/private/protected

### Key Issues Identified
1. Business logic embedded in components (scroll handling, DOM manipulation)
2. Inconsistent access modifier patterns
3. Missing explicit return types on methods
4. Services underutilized for business logic encapsulation
5. Some redundant type annotations

## Phase 1: Access Modifiers & Type Safety (Low Risk)
**Duration:** 1-2 hours  
**Risk Level:** Low  
**Rollback Strategy:** Git revert

### Tasks
1. **Standardize Access Modifiers**
   - Update all components, services, and stores to follow modifier policy
   - Pattern: private → protected → implicit public (no explicit "public" keyword)
   - Target files: ~15 components, 3 services, 4 stores
   - Use find/replace patterns for automation

2. **Fix Type Annotations**
   - Add explicit return types to all methods
   - Remove redundant type annotations where trivially inferred
   - Strengthen variable typing where needed
   - Focus on method signatures first

### Files to Update
- All components in `/features`, `/layout`, `/ui`, `/pattern`
- Services in `/core/services` and `/features/*/services`
- All store files (`*.store.ts`)

## Phase 2: Extract Business Logic to Services (Medium Risk)
**Duration:** 2-3 hours  
**Risk Level:** Medium  
**Rollback Strategy:** Feature branch isolation

### Tasks
1. **Create Feature Services**
   
   **PostsListService** (`/features/main-page/services/posts-list.service.ts`)
   - Extract scroll progress calculations
   - Move DOM manipulation logic
   - Handle scroll event management
   
   **PostService** (`/features/post/services/post.service.ts`)
   - Extract `styleCodeBlock()` method
   - Move `showCodeModal()` logic
   - Consolidate code block handling
   
   **AuthFormService** (`/layout/services/auth-form.service.ts`)
   - Extract form validation logic
   - Move form creation utilities
   - Centralize validation rules

2. **Component Refactoring**
   
   **PostsListComponent**
   - Inject PostsListService
   - Delegate scroll logic to service
   - Keep template bindings minimal
   
   **PostComponent**
   - Inject PostService
   - Move all code block logic to service
   - Simplify component to coordination only
   
   **Login/RegisterComponent**
   - Extract validation to AuthFormService
   - Keep only form binding logic
   - Delegate business rules to service

## Phase 3: Store & State Rationalization (Low Risk)
**Duration:** 1 hour  
**Risk Level:** Low  
**Rollback Strategy:** Store-by-store revert

### Tasks
1. **Store Consolidation Review**
   - Keep stores feature-scoped (current pattern is good)
   - Review computed properties for optimization opportunities
   - Ensure consistent error handling patterns
   - Standardize loading/error state management

2. **Store Improvements**
   - Add consistent error typing
   - Ensure all async operations handle errors
   - Review selector performance
   - Add missing loading states where needed

### Stores to Review
- `posts.store.ts` - Check computed properties
- `tags.store.ts` - Verify error handling
- `post.store.ts` - Optimize selectors
- `comments.store.ts` - Standardize state shape

## Phase 4: Folder Structure Optimization (Medium Risk)
**Duration:** 1-2 hours  
**Risk Level:** Medium  
**Rollback Strategy:** Git move commands can be reverted

### Proposed Structure
```
projects/web/src/app/
├── core/
│   ├── auth/
│   ├── http/
│   ├── services/
│   └── utils/
├── features/
│   ├── main-page/
│   │   ├── components/
│   │   │   ├── posts-list/
│   │   │   └── about-me/
│   │   ├── services/
│   │   │   └── posts-list.service.ts
│   │   ├── stores/
│   │   │   ├── posts.store.ts
│   │   │   └── tags.store.ts
│   │   └── main-page.routes.ts
│   └── post/
│       ├── components/
│       │   ├── details/
│       │   ├── comments/
│       │   └── add-comment/
│       ├── services/
│       │   ├── post.service.ts
│       │   └── social-share.service.ts
│       ├── stores/
│       │   ├── post.store.ts
│       │   └── comments.store.ts
│       └── post.routes.ts
├── layout/
│   ├── main-layout/
│   ├── navbar/
│   ├── login/
│   ├── register/
│   └── services/
│       └── auth-form.service.ts
├── pattern/
│   └── cookie-consent/
└── ui/
    └── components/
        ├── post-card/
        └── label/
```

### Migration Steps
1. Create service directories in each feature
2. Move stores to dedicated stores/ subdirectories
3. Group related components under components/
4. Update imports after moves
5. Run build to verify paths

## Phase 5: Angular 20 Best Practices (Low Risk)
**Duration:** 1 hour  
**Risk Level:** Low  
**Rollback Strategy:** Individual fix revert

### Tasks
1. **Signal Adoption Review**
   - Components already using signals correctly
   - Review for additional signal opportunities
   - Ensure consistent signal patterns
   - Optimize change detection where possible

2. **RxJS Optimization**
   - Add `takeUntilDestroyed` where missing
   - Ensure no nested subscribes exist
   - Verify async pipe usage in templates
   - Review operator usage for efficiency

3. **Performance Improvements**
   - Review change detection strategies
   - Ensure OnPush where appropriate
   - Optimize template expressions
   - Review bundle size impact

## Execution Strategy

### Incremental Rollout Plan
1. **Day 1**: Phase 1 (Access Modifiers & Types)
   - Morning: Run automated access modifier updates
   - Afternoon: Add method return types
   - Test: `npm run lint && npm run build`

2. **Day 2**: Phase 2 (Business Logic Extraction)
   - Morning: Create services for main-page feature
   - Afternoon: Create services for post feature
   - Test: Feature-by-feature testing

3. **Day 3**: Phases 3-5 (Stores, Structure, Best Practices)
   - Morning: Store rationalization and folder restructure
   - Afternoon: Angular 20 optimizations
   - Test: Full application testing

### Risk Mitigation
- Create feature branch for each phase
- Run tests after each major change
- Keep refactoring minimal - no over-engineering
- Preserve all existing functionality
- Document changes in CLAUDE.md

### Verification Checkpoints
- [ ] Lint passes after each phase
- [ ] Build succeeds without warnings
- [ ] App runs with smoke test of main routes
- [ ] Bundle size stable or reduced
- [ ] All stores and services functional
- [ ] No console errors in browser
- [ ] Performance metrics maintained

## Acceptance Criteria

### Technical Requirements
- ✅ Access modifier policy enforced
- ✅ All methods have explicit return types
- ✅ Business logic in services, not components
- ✅ Consistent store patterns
- ✅ Clean folder structure
- ✅ Angular 20 best practices applied

### Quality Gates
1. `npm run lint` - Zero errors
2. `npm run build` - Successful build
3. `npm start` - Application runs
4. Manual testing - Core features work
5. Bundle size - Not increased by >5%

## Manual QA Steps
1. **Build Verification**
   ```bash
   npm install
   npm run lint
   npm run build
   ```

2. **Functional Testing**
   ```bash
   npm start
   ```
   - Navigate to home page
   - View posts list
   - Open individual post
   - Test comments functionality
   - Verify authentication flow

3. **Service Testing**
   - Verify services encapsulate logic
   - Check components are declarative
   - Ensure stores maintain state correctly
   - Test error handling paths

## Rollback Plan
Each phase is isolated in its own git branch:
- `refactor/phase-1-access-modifiers`
- `refactor/phase-2-extract-services`
- `refactor/phase-3-stores`
- `refactor/phase-4-structure`
- `refactor/phase-5-best-practices`

If issues arise, revert the specific phase branch and investigate.

## Summary
**What:** Refactor projects/web for clean Angular 20 patterns  
**Why:** Improve maintainability, standardize patterns, optimize performance  
**How to Verify:** Run `npm lint && npm build && npm start`, test main routes  
**Timeline:** 3 days, phase-by-phase execution  
**Risk Level:** Low to Medium, with clear rollback strategy