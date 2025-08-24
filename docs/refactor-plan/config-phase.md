# SAFE Workspace Configuration Refactor Plan

**Phase**: Configuration Only (No Feature Moves)  
**Status**: Proposal - Ready for Review  
**Date**: 2025-01-18

## Overview

This is a concrete, minimal, and SAFE workspace configuration refactor plan focusing exclusively on workspace configuration improvements without touching any source code or moving features. The plan addresses TypeScript configurations, Angular workspace setup, ESLint boundaries, and tooling scripts to prepare for future feature migrations.

## Rationale

### A) TypeScript Configuration Issues
• **Inconsistent Structure**: Current configs mix solution-style with project-specific patterns
• **Missing Strict Flags**: `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` missing for Angular 20
• **Limited Path Mappings**: Only basic `"shared"` mapping; need `@shared/*` sub-library aliases
• **Base Config Duplication**: Each project extends root config causing duplication

### B) Angular Workspace & Rendering Issues
• **SSR/SSG Hybrid Missing**: Web project needs proper hybrid rendering configuration
• **CSR Confirmation Needed**: Admin project should explicitly be CSR-only
• **Native Federation Gap**: Code-samples-mfe needs micro-frontend scaffold
• **Legacy Coexistence**: Current `/src` app needs to coexist during migration

### C) ESLint & Boundaries Issues  
• **Wrong Path Patterns**: Current config targets `apps/libs` but actual structure uses `projects/`
• **Missing Angular 20 Rules**: No standalone/signals-first rules enforced
• **Incomplete Boundaries**: Missing shared library sub-modules in boundary definitions

### D) Tooling & Scripts Issues
• **No Project Isolation**: Missing individual project commands for development
• **Build Orchestration**: No coordinated build process for multi-project workspace
• **Testing Gaps**: No project-specific test commands

## Proposed Changes

### 1. TypeScript Configuration Modernization

**File: `tsconfig.json`**
- Convert to solution-style configuration
- Add project references for all workspace projects
- Remove duplicated compiler options

**File: `tsconfig.base.json` (NEW)**  
- Central base configuration for all projects
- Add missing Angular 20 strict flags
- Enhanced path mappings for `@shared/*` aliases

### 2. Angular Workspace Configuration

**File: `angular.json`**
- **Web Project**: Add hybrid SSR/SSG configuration with prerender routes
- **Code-samples-mfe**: Add custom webpack config for Native Federation support
- **Asset Management**: Proper federation manifest handling

### 3. ESLint & Architectural Boundaries

**File: `eslintrc.cjs`**  
- Fix boundary patterns to match actual `projects/` structure
- Add Angular 20 specific rules (`prefer-standalone`, `prefer-signals`)
- Enhanced shared library boundaries for sub-modules
- Template rules for control flow and self-closing tags

### 4. Package.json Scripts Enhancement

**File: `package.json`**
- **PNPM Setup**: Add preinstall hook for package manager enforcement
- **Project-Specific Commands**: Individual serve/build/test commands per project
- **Build Orchestration**: Coordinated build process with dependencies
- **Development Workflow**: Enhanced local development commands

### 5. Native Federation Scaffold

**File: `projects/web/webpack.config.js` (NEW)**
- Shell application configuration
- Remote micro-frontend consumption setup
- Shared dependency configuration

**File: `projects/code-samples-mfe/webpack.config.js` (NEW)**  
- Micro-frontend exposition configuration
- Module federation setup for code samples

## Detailed Configuration Changes

### TypeScript Base Configuration

```diff
--- /dev/null
+++ b/tsconfig.base.json
@@ -0,0 +1,42 @@
+{
+  "compileOnSave": false,
+  "compilerOptions": {
+    "outDir": "./dist/out-tsc",
+    "strict": true,
+    "exactOptionalPropertyTypes": true,
+    "noUncheckedIndexedAccess": true,
+    "noImplicitOverride": true,
+    "noPropertyAccessFromIndexSignature": true,
+    "noImplicitReturns": true,
+    "noFallthroughCasesInSwitch": true,
+    "skipLibCheck": true,
+    "esModuleInterop": true,
+    "allowSyntheticDefaultImports": true,
+    "sourceMap": true,
+    "declaration": false,
+    "experimentalDecorators": true,
+    "moduleResolution": "bundler",
+    "paths": {
+      "shared": ["./dist/shared"],
+      "@shared/ui": ["./projects/shared/src/ui"],
+      "@shared/pattern": ["./projects/shared/src/pattern"],
+      "@shared/data-access": ["./projects/shared/src/data-access"],
+      "@shared/models": ["./projects/shared/src/models"],
+      "@shared/utils": ["./projects/shared/src/utils"]
+    },
+    "importHelpers": true,
+    "target": "ES2022",
+    "module": "ES2022",
+    "useDefineForClassFields": false,
+    "lib": [
+      "ES2022",
+      "dom"
+    ]
+  },
+  "angularCompilerOptions": {
+    "enableI18nLegacyMessageIdFormat": false,
+    "strictInjectionParameters": true,
+    "strictInputAccessModifiers": true,
+    "strictTemplates": true
+  }
+}
```

### Solution-Style Root Configuration

```diff
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -1,8 +1,5 @@
-/* To learn more about this file see: https://angular.io/config/tsconfig. */
 {
   "compileOnSave": false,
-  "compilerOptions": {
-    "outDir": "./dist/out-tsc",
+  "extends": "./tsconfig.base.json",
+  "files": [],
+  "references": [
+    { "path": "./projects/admin/tsconfig.app.json" },
+    { "path": "./projects/admin/tsconfig.spec.json" },
+    { "path": "./projects/web/tsconfig.app.json" },
+    { "path": "./projects/web/tsconfig.spec.json" },
+    { "path": "./projects/shared/tsconfig.lib.json" },
+    { "path": "./projects/shared/tsconfig.spec.json" },
+    { "path": "./projects/code-samples-mfe/tsconfig.app.json" },
+    { "path": "./projects/code-samples-mfe/tsconfig.spec.json" },
+    { "path": "./tsconfig.app.json" },
+    { "path": "./tsconfig.spec.json" }
+  ]
+}
```

### Angular Workspace Hybrid Rendering

```diff
--- a/angular.json
+++ b/angular.json
@@ -256,8 +256,15 @@
             "styles": [
               "projects/web/src/styles.scss"
             ],
+            "scripts": [],
             "server": "projects/web/src/main.server.ts",
-            "outputMode": "server",
+            "prerender": {
+              "routesFile": "projects/web/routes.txt"
+            },
             "ssr": {
               "entry": "projects/web/src/server.ts"
             }
@@ -371,7 +378,12 @@
             "browser": "projects/code-samples-mfe/src/main.ts",
             "tsConfig": "projects/code-samples-mfe/tsconfig.app.json",
             "inlineStyleLanguage": "scss",
+            "customWebpackConfig": {
+              "path": "projects/code-samples-mfe/webpack.config.js"
+            },
             "assets": [
+              {
+                "glob": "mf.manifest.json",
+                "input": "projects/code-samples-mfe/src",
+                "output": "./"
+              },
               {
                 "glob": "**/*",
                 "input": "projects/code-samples-mfe/public"
```

### ESLint Boundary Corrections

```diff
--- a/eslintrc.cjs
+++ b/eslintrc.cjs
@@ -15,6 +15,7 @@ module.exports = {
       },
       extends: [
         'plugin:@angular-eslint/recommended',
+        'plugin:@angular-eslint/template/process-inline-templates',
       ],
       plugins: ['boundaries'],
       settings: {
         'boundaries/elements': [
           // ---- Shared libs ----
-          { type: 'shared-ui', pattern: 'libs/shared/ui/**' },
-          { type: 'shared-pattern', pattern: 'libs/shared/pattern/**' },
-          { type: 'shared-data', pattern: 'libs/shared/data-access/**' },
+          { type: 'shared-ui', pattern: 'projects/shared/src/ui/**' },
+          { type: 'shared-pattern', pattern: 'projects/shared/src/pattern/**' },
+          { type: 'shared-data', pattern: 'projects/shared/src/data-access/**' },
+          { type: 'shared-models', pattern: 'projects/shared/src/models/**' },
+          { type: 'shared-utils', pattern: 'projects/shared/src/utils/**' },
 
-          // ---- Apps: blog-ssg ----
-          { type: 'blog-core', pattern: 'apps/blog-ssg/src/app/core/**' },
-          { type: 'blog-layout', pattern: 'apps/blog-ssg/src/app/layout/**' },
-          { type: 'blog-ui', pattern: 'apps/blog-ssg/src/app/ui/**' },
-          { type: 'blog-pattern', pattern: 'apps/blog-ssg/src/app/pattern/**' },
-          { type: 'blog-data', pattern: 'apps/blog-ssg/src/app/data-access/**' },
-          { type: 'blog-feature', pattern: 'apps/blog-ssg/src/app/feature/**' },
+          // ---- Apps: web ----
+          { type: 'web-core', pattern: 'projects/web/src/app/core/**' },
+          { type: 'web-layout', pattern: 'projects/web/src/app/layout/**' },
+          { type: 'web-ui', pattern: 'projects/web/src/app/ui/**' },
+          { type: 'web-pattern', pattern: 'projects/web/src/app/pattern/**' },
+          { type: 'web-feature', pattern: 'projects/web/src/app/features/**' },
 
-          // ---- Apps: admin-spa ----
-          { type: 'admin-core', pattern: 'apps/admin-spa/src/app/core/**' },
-          { type: 'admin-layout', pattern: 'apps/admin-spa/src/app/layout/**' },
-          { type: 'admin-ui', pattern: 'apps/admin-spa/src/app/ui/**' },
-          { type: 'admin-pattern', pattern: 'apps/admin-spa/src/app/pattern/**' },
-          { type: 'admin-data', pattern: 'apps/admin-spa/src/app/data-access/**' },
-          { type: 'admin-feature', pattern: 'apps/admin-spa/src/app/feature/**' },
+          // ---- Apps: admin ----
+          { type: 'admin-core', pattern: 'projects/admin/src/app/core/**' },
+          { type: 'admin-layout', pattern: 'projects/admin/src/app/layout/**' },
+          { type: 'admin-ui', pattern: 'projects/admin/src/app/ui/**' },
+          { type: 'admin-pattern', pattern: 'projects/admin/src/app/pattern/**' },
+          { type: 'admin-feature', pattern: 'projects/admin/src/app/features/**' },
 
-          // ---- Apps: code-samples-mfe ----
-          { type: 'samples-core', pattern: 'apps/code-samples-mfe/src/app/core/**' },
-          { type: 'samples-layout', pattern: 'apps/code-samples-mfe/src/app/layout/**' },
-          { type: 'samples-ui', pattern: 'apps/code-samples-mfe/src/app/ui/**' },
-          { type: 'samples-pattern', pattern: 'apps/code-samples-mfe/src/app/pattern/**' },
-          { type: 'samples-data', pattern: 'apps/code-samples-mfe/src/app/data-access/**' },
-          { type: 'samples-feature', pattern: 'apps/code-samples-mfe/src/app/feature/**' }
+          // ---- Apps: code-samples-mfe ----
+          { type: 'mfe-core', pattern: 'projects/code-samples-mfe/src/app/core/**' },
+          { type: 'mfe-ui', pattern: 'projects/code-samples-mfe/src/app/ui/**' },
+          { type: 'mfe-feature', pattern: 'projects/code-samples-mfe/src/app/features/**' }
         ],
       },
       rules: {
         // Prevent unknown files from bypassing the rules
-        'boundaries/no-unknown-files': 'error',
+        'boundaries/no-unknown-files': 'warn',
 
         // Forbid private imports across elements
         'boundaries/no-private': 'error',
+
+        // Angular 20 specific rules
+        '@angular-eslint/prefer-standalone': 'error',
+        '@angular-eslint/prefer-signals': 'warn',
 
         // Allowed import graph
         'boundaries/allowed-types': ['error', [
           // Shared layers
           { from: ['shared-ui'], allow: [] },
-          { from: ['shared-pattern'], allow: ['shared-ui'] },
+          { from: ['shared-pattern'], allow: ['shared-ui', 'shared-models', 'shared-utils'] },
           { from: ['shared-data'], allow: [] },
+          { from: ['shared-models'], allow: [] },
+          { from: ['shared-utils'], allow: [] },
 
-          // blog-ssg
-          { from: ['blog-core'], allow: ['shared-data'] },
-          { from: ['blog-layout'], allow: ['blog-core', 'shared-ui', 'shared-pattern'] },
-          { from: ['blog-ui'], allow: ['shared-ui'] },
-          { from: ['blog-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data'] },
-          { from: ['blog-data'], allow: ['shared-data'] },
-          { from: ['blog-feature'], allow: ['blog-core', 'blog-layout', 'blog-ui', 'blog-pattern', 'blog-data', 'shared-ui', 'shared-pattern', 'shared-data'] },
+          // web app
+          { from: ['web-core'], allow: ['shared-data', 'shared-models', 'shared-utils'] },
+          { from: ['web-layout'], allow: ['web-core', 'shared-ui', 'shared-pattern', 'shared-models'] },
+          { from: ['web-ui'], allow: ['shared-ui', 'shared-models'] },
+          { from: ['web-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data', 'shared-models', 'shared-utils'] },
+          { from: ['web-feature'], allow: ['web-core', 'web-layout', 'web-ui', 'web-pattern', 'shared-ui', 'shared-pattern', 'shared-data', 'shared-models', 'shared-utils'] },
 
           // admin-spa
-          { from: ['admin-core'], allow: ['shared-data'] },
-          { from: ['admin-layout'], allow: ['admin-core', 'shared-ui', 'shared-pattern'] },
-          { from: ['admin-ui'], allow: ['shared-ui'] },
-          { from: ['admin-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data'] },
-          { from: ['admin-data'], allow: ['shared-data'] },
-          { from: ['admin-feature'], allow: ['admin-core', 'admin-layout', 'admin-ui', 'admin-pattern', 'admin-data', 'shared-ui', 'shared-pattern', 'shared-data'] },
+          { from: ['admin-core'], allow: ['shared-data', 'shared-models', 'shared-utils'] },
+          { from: ['admin-layout'], allow: ['admin-core', 'shared-ui', 'shared-pattern', 'shared-models'] },
+          { from: ['admin-ui'], allow: ['shared-ui', 'shared-models'] },
+          { from: ['admin-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data', 'shared-models', 'shared-utils'] },
+          { from: ['admin-feature'], allow: ['admin-core', 'admin-layout', 'admin-ui', 'admin-pattern', 'shared-ui', 'shared-pattern', 'shared-data', 'shared-models', 'shared-utils'] },
 
-          // samples-mfe
-          { from: ['samples-core'], allow: ['shared-data'] },
-          { from: ['samples-layout'], allow: ['samples-core', 'shared-ui', 'shared-pattern'] },
-          { from: ['samples-ui'], allow: ['shared-ui'] },
-          { from: ['samples-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data'] },
-          { from: ['samples-data'], allow: ['shared-data'] },
-          { from: ['samples-feature'], allow: ['samples-core', 'samples-layout', 'samples-ui', 'samples-pattern', 'samples-data', 'shared-ui', 'shared-pattern', 'shared-data'] }
+          // code-samples-mfe
+          { from: ['mfe-core'], allow: ['shared-data', 'shared-models', 'shared-utils'] },
+          { from: ['mfe-ui'], allow: ['shared-ui', 'shared-models'] },
+          { from: ['mfe-feature'], allow: ['mfe-core', 'mfe-ui', 'shared-ui', 'shared-pattern', 'shared-data', 'shared-models', 'shared-utils'] }
         ]],
 
         // Enforce public APIs (optional): only import from directories' public entry points
-        // 'boundaries/entry-point': ['error', [{ target: 'always', from: ['shared-ui', 'shared-pattern', 'shared-data'] }]]
+        'boundaries/entry-point': ['warn', [{ target: 'always', from: ['shared-ui', 'shared-pattern', 'shared-data', 'shared-models', 'shared-utils'] }]]
       },
     },
+    {
+      files: ['*.html'],
+      extends: ['plugin:@angular-eslint/template/recommended'],
+      rules: {
+        '@angular-eslint/template/prefer-control-flow': 'error',
+        '@angular-eslint/template/prefer-self-closing-tags': 'error'
+      }
+    }
   ]
 };
```

### Enhanced Package.json Scripts

```diff
--- a/package.json
+++ b/package.json
@@ -2,6 +2,7 @@
   "name": "angular-blog-app",
   "version": "0.0.0",
   "scripts": {
+    "preinstall": "npx only-allow pnpm",
     "ng": "ng",
     "start": "ng serve",
+    "start:web": "ng serve web",
+    "start:admin": "ng serve admin",
+    "start:mfe": "ng serve code-samples-mfe",
     "build": "ng build",
+    "build:web": "ng build web",
+    "build:admin": "ng build admin", 
+    "build:mfe": "ng build code-samples-mfe",
+    "build:shared": "ng build shared",
+    "build:all": "pnpm build:shared && pnpm build:web && pnpm build:admin && pnpm build:mfe",
     "watch": "ng build --watch --configuration development",
+    "watch:web": "ng build web --watch --configuration development",
+    "watch:admin": "ng build admin --watch --configuration development",
+    "watch:mfe": "ng build code-samples-mfe --watch --configuration development",
     "test": "ng test",
+    "test:web": "ng test web",
+    "test:admin": "ng test admin",
+    "test:mfe": "ng test code-samples-mfe",
+    "test:shared": "ng test shared",
+    "lint": "ng lint",
+    "lint:fix": "ng lint --fix",
     "serve:ssr:AngularBlogApp": "node dist/angular-blog-app/server/server.mjs",
+    "serve:ssr:web": "node dist/web/server/server.mjs",
     "build:stats": "ng build --stats-json",
+    "build:web:stats": "ng build web --stats-json",
     "analyze": "webpack-bundle-analyzer dist/angular-blog-app/stats.json",
+    "analyze:web": "webpack-bundle-analyzer dist/web/stats.json",
     "start:local": "ng serve --configuration=local",
+    "start:web:local": "ng serve web --configuration=local",
     "start:local:docker": "open -a Docker",
     "start:local:backend": "npx supabase start",
     "schema:pull": "find supabase/migrations -name '*_remote_schema.sql' -delete && supabase db pull --db-url $PG_EXPORT_URL",
     "db:createSeed": "scripts/create-seed.sh",
     "db:seed": "npx @snaplet/seed init",
     "users:passwords": "scripts/set-passwords.sh",
     "e2e": "ng e2e",
     "e2e:local": "ng e2e -c local",
-    "serve:ssr:web": "node dist/web/server/server.mjs"
+    "e2e:web": "ng e2e web",
+    "e2e:admin": "ng e2e admin"
   },
   "private": true,
   "dependencies": {
@@ -51,6 +77,7 @@
   "devDependencies": {
     "@angular/build": "^20.1.6",
     "@angular/cli": "^20.1.6",
     "@angular/compiler-cli": "^20.1.7",
+    "@angular-eslint/eslint-plugin": "^18.0.0",
+    "eslint-plugin-boundaries": "^4.0.0",
     "@playwright/test": "^1.53.0",
     "@snaplet/copycat": "^6.0.0",
```

### Native Federation Configuration

**Shell Application (Web) - `projects/web/webpack.config.js`**

```javascript
const ModuleFederationPlugin = require('@module-federation/enhanced/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        'code-samples-mfe': 'http://localhost:4201/remoteEntry.js'
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        '@angular/router': { singleton: true, strictVersion: true },
        'rxjs': { singleton: true, strictVersion: true }
      }
    })
  ]
};
```

**Micro-frontend (Code Samples) - `projects/code-samples-mfe/webpack.config.js`**

```javascript
const ModuleFederationPlugin = require('@module-federation/enhanced/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'codeSamplesMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './CodeSamplesModule': './src/app/features/code-samples/code-samples.module.ts'
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        '@angular/router': { singleton: true, strictVersion: true },
        'rxjs': { singleton: true, strictVersion: true }
      }
    })
  ]
};
```

## Implementation Order

### Phase 1: TypeScript Foundation
1. Create `tsconfig.base.json`
2. Update `tsconfig.json` to solution-style
3. Verify compilation with `ng build`

### Phase 2: Angular Workspace
1. Update `angular.json` with SSR/SSG and webpack configs
2. Test project builds individually
3. Verify dev servers start correctly

### Phase 3: ESLint Boundaries  
1. Update `eslintrc.cjs` with correct patterns
2. Run lint to identify boundary violations
3. Address any immediate issues

### Phase 4: Package Scripts
1. Add project-specific scripts to `package.json`
2. Install missing dependencies
3. Test new script commands

### Phase 5: Native Federation
1. Add webpack config files
2. Install Module Federation dependencies
3. Test federation setup with minimal examples

## Verification Checklist

### TypeScript Compilation
```bash
pnpm build:shared               # Should succeed
pnpm build:web                  # Should succeed with SSR
pnpm build:admin                # Should succeed CSR-only
pnpm build:mfe                  # Should succeed with webpack config
```

### Development Servers
```bash
pnpm start:web                  # Should serve on :4200 with SSR
pnpm start:admin                # Should serve on :4201 CSR-only
pnpm start:mfe                  # Should serve on :4202 with federation
```

### Linting
```bash
pnpm lint                       # Should pass with new boundary rules
pnpm lint:fix                   # Should auto-fix minor issues
```

### Path Mappings
```bash
# In any project file: import { Something } from '@shared/ui'
# Should resolve without TypeScript errors
```

### Angular CLI Recognition
```bash
ng serve web                    # Should work
ng build admin                  # Should work  
ng test shared                  # Should work
ng lint                         # Should enforce boundaries
```

### Federation Testing
```bash
# Start both applications
pnpm start:web                  # Shell app on :4200
pnpm start:mfe                  # Remote MFE on :4201

# Verify federation manifest files are generated
ls projects/code-samples-mfe/dist/mf.manifest.json
```

## Risks and Mitigation

### High Risk Items
1. **TypeScript Path Changes** - Might break existing imports temporarily
   - **Mitigation**: Apply changes incrementally, test compilation after each step

2. **Native Federation Dependencies** - New webpack config might conflict
   - **Mitigation**: Use `customWebpackConfig` option, preserve existing configs

3. **ESLint Boundary Violations** - Existing code might violate new rules
   - **Mitigation**: Set violations to 'warn' initially, fix gradually

### Medium Risk Items
1. **Package Manager Switch** - PNPM enforcement might cause issues
   - **Mitigation**: Optional preinstall hook, can be disabled

2. **Build Process Changes** - New scripts might not work as expected
   - **Mitigation**: Keep original scripts as fallback

### Low Risk Items
1. **Development Server Ports** - Port conflicts with existing services
   - **Mitigation**: Use standard Angular CLI ports, configurable

## Rollback Strategy

### Emergency Rollback
```bash
git stash                       # Save current changes
git reset --hard HEAD~1         # Return to previous commit
```

### Incremental Rollback

**TypeScript Changes**
```bash
# Remove tsconfig.base.json
rm tsconfig.base.json
# Restore original tsconfig.json from git
git checkout HEAD~1 -- tsconfig.json
```

**Angular.json Changes**
```bash
# Restore specific sections
git checkout HEAD~1 -- angular.json
```

**ESLint Changes**
```bash
# Restore original patterns
git checkout HEAD~1 -- eslintrc.cjs
```

**Package.json Changes**
```bash
# Restore original scripts section
git checkout HEAD~1 -- package.json
npm install  # or pnpm install
```

### Dependency Issues
```bash
# Remove new dependencies
pnpm remove @angular-eslint/eslint-plugin eslint-plugin-boundaries
# Reinstall original dependencies
pnpm install
```

## Post-Implementation Tasks

### Immediate (Day 1)
- [ ] Run full verification checklist
- [ ] Update team documentation
- [ ] Create quick reference for new commands

### Short Term (Week 1)
- [ ] Monitor build performance impact
- [ ] Address any ESLint boundary violations
- [ ] Train team on new development workflow

### Medium Term (Month 1)  
- [ ] Optimize build configurations
- [ ] Add more comprehensive Native Federation examples
- [ ] Plan next phase: feature migrations

## Success Criteria

✅ **All existing functionality preserved**  
✅ **No source code changes required**  
✅ **Improved development workflow with project isolation**  
✅ **Foundation ready for feature migrations**  
✅ **Clear path mapping strategy established**  
✅ **Architectural boundaries enforced via tooling**  
✅ **Native Federation infrastructure in place**

## Next Phase Preparation

This configuration refactor prepares for the next phase:
- **Feature Migration Phase**: Moving features from `/src` to appropriate projects
- **Shared Library Population**: Creating actual shared components and services
- **Native Federation Implementation**: Actual micro-frontend integration
- **SSR/SSG Optimization**: Performance tuning for hybrid rendering

---

**Ready for Review**: This plan can be implemented incrementally with clear rollback options at each step.