Angular Blog App - Comprehensive Refactoring Plan │ │
│ │ │ │
│ │ 🎯 Goal │ │
│ │ │ │
│ │ Refactor the entire Angular Blog App structure to strictly comply with the BOOK architecture principles defined in /llms/public/architecture.md. │ │
│ │ │ │
│ │ 📋 Major Architecture Violations Found │ │
│ │ │ │
│ │ 1. CRITICAL: Type-Bucket Folders (FORBIDDEN)                                                                                                                                                                                 │ │
│ │ │ │
│ │ These violate the domain-first principle and must be eliminated:                                                                                                                                                             │ │
│ │ │ │
│ │ Web App (projects/web)                                                                                                                                                                                                       │ │
│ │ │ │
│ │ - ❌ /features/post/components/ → Flatten to feature root │ │
│ │ - ❌ /features/post/services/ → Flatten to feature root │ │
│ │ - ❌ /features/post/stores/ → Flatten to feature root │ │
│ │ - ❌ /features/main-page/components/ → Flatten to feature root │ │
│ │ - ❌ /features/main-page/services/ → Flatten to feature root │ │
│ │ - ❌ /features/main-page/stores/ → Flatten to feature root │ │
│ │ - ❌ /core/services/ → Move to /core/blog/ (domain-first)                                                                                                                                                                     │ │
│ │ - ❌ /layout/services/ → Extract to shared pattern │ │
│ │ │ │
│ │ Admin App (projects/admin)                                                                                                                                                                                                   │ │
│ │ │ │
│ │ - ❌ /features/add-post/models/ → Flatten to feature root │ │
│ │ - ❌ /features/add-post/services/ → Flatten to feature root │ │
│ │ - ❌ /features/add-post/guards/ → Flatten to feature root │ │
│ │ │ │
│ │ 2. Component Organization Issues │ │
│ │ │ │
│ │ - ✅ post-card component: Only used in web, keep in web but restructure location │ │
│ │ - ✅ label component: Only used in web, keep in web but restructure location │ │
│ │ - ❌ Empty /admin/ui/ folder → Remove │ │
│ │ │ │
│ │ 3. Shared Library Domain Organization │ │
│ │ │ │
│ │ - ❌ /shared/src/services/ → Remove (empty anyway)                                                                                                                                                                            │ │
│ │ - ✅ Models are properly domain-organized │ │
│ │ - ✅ Pattern folder exists and is used correctly │ │
│ │ - Need to add domain-specific organization for data-access │ │
│ │ │ │
│ │ 4. Auth Logic Duplication │ │
│ │ │ │
│ │ Both apps have nearly identical auth form logic:                                                                                                                                                                             │ │
│ │ - Web: Uses auth-form.service.ts abstraction │ │
│ │ - Admin: Inline logic in component │ │
│ │ - Solution: Extract common auth form logic to /shared/src/pattern/auth/ │ │
│ │ │ │
│ │ 📂 Refactoring Steps │ │
│ │ │ │
│ │ Phase 1: Fix Type-Bucket Violations in Features │ │
│ │ │ │
│ │ Web App - Post Feature │ │
│ │ │ │
│ │ FROM:                                                                                                                                                                                                                        │ │
│ │ /features/post/ │ │
│ │ ├── components/ │ │
│ │ │ └── details/ │ │
│ │ │ ├── post.component.ts │ │
│ │ │ ├── comments/ │ │
│ │ │ ├── add-comment/ │ │
│ │ │ └── code-block-modal-component/ │ │
│ │ ├── services/ │ │
│ │ │ ├── post.service.ts │ │
│ │ │ └── social-share.service.ts │ │
│ │ └── stores/ │ │
│ │ ├── post.store.ts │ │
│ │ └── comments.store.ts │ │
│ │ │ │
│ │ TO:                                                                                                                                                                                                                          │ │
│ │ /features/post/ │ │
│ │ ├── post.routes.ts │ │
│ │ ├── post.component.ts (main feature component)                                                                                                                                                                             │ │
│ │ ├── post.component.html │ │
│ │ ├── post.component.scss │ │
│ │ ├── post.store.ts (flat at root)                                                                                                                                                                                           │ │
│ │ ├── comments.store.ts (flat at root)                                                                                                                                                                                       │ │
│ │ ├── post.service.ts (flat at root)                                                                                                                                                                                         │ │
│ │ ├── social-share.service.ts (flat at root)                                                                                                                                                                                 │ │
│ │ ├── comments/ (component subfolder for <comments> tag)                                                                                                                                                                     │ │
│ │ │ ├── comments.component.ts │ │
│ │ │ ├── comments.component.html │ │
│ │ │ └── comments.component.scss │ │
│ │ ├── add-comment/ (component subfolder for <add-comment> tag)                                                                                                                                                               │ │
│ │ │ ├── add-comment.component.ts │ │
│ │ │ ├── add-comment.component.html │ │
│ │ │ └── add-comment.component.scss │ │
│ │ └── code-block-modal/ (renamed, component subfolder)                                                                                                                                                                       │ │
│ │ └── code-block-modal.component.ts │ │
│ │ │ │
│ │ Web App - Main Page Feature │ │
│ │ │ │
│ │ FROM:                                                                                                                                                                                                                        │ │
│ │ /features/main-page/ │ │
│ │ ├── components/ │ │
│ │ │ └── posts-list/ │ │
│ │ │ ├── posts-list.component.ts │ │
│ │ │ └── about-me/ │ │
│ │ ├── services/ │ │
│ │ │ └── posts-list.service.ts │ │
│ │ └── stores/ │ │
│ │ ├── posts.store.ts │ │
│ │ └── tags.store.ts │ │
│ │ │ │
│ │ TO:                                                                                                                                                                                                                          │ │
│ │ /features/main-page/ │ │
│ │ ├── main-page.component.ts │ │
│ │ ├── main-page.component.html │ │
│ │ ├── main-page.component.scss │ │
│ │ ├── posts-list.service.ts (flat at root)                                                                                                                                                                                   │ │
│ │ ├── posts.store.ts (flat at root)                                                                                                                                                                                          │ │
│ │ ├── tags.store.ts (flat at root)                                                                                                                                                                                           │ │
│ │ ├── posts-list/ (component subfolder)                                                                                                                                                                                      │ │
│ │ │ ├── posts-list.component.ts │ │
│ │ │ ├── posts-list.component.html │ │
│ │ │ └── posts-list.component.scss │ │
│ │ └── about-me/ (component subfolder)                                                                                                                                                                                        │ │
│ │ ├── about-me.component.ts │ │
│ │ ├── about-me.component.html │ │
│ │ └── about-me.component.scss │ │
│ │ │ │
│ │ Admin App - Add Post Feature │ │
│ │ │ │
│ │ FROM:                                                                                                                                                                                                                        │ │
│ │ /features/add-post/ │ │
│ │ ├── models/ │ │
│ │ │ ├── post-form.interface.ts │ │
│ │ │ └── processed-post-data.interface.ts │ │
│ │ ├── services/ │ │
│ │ │ └── post-form.service.ts │ │
│ │ └── guards/ │ │
│ │ └── unsaved-changes.guard.ts │ │
│ │ │ │
│ │ TO:                                                                                                                                                                                                                          │ │
│ │ /features/add-post/ │ │
│ │ ├── add-post.routes.ts │ │
│ │ ├── add-post.component.ts │ │
│ │ ├── add-post.component.html │ │
│ │ ├── add-post.component.scss │ │
│ │ ├── add-post.store.ts │ │
│ │ ├── add-post.service.ts │ │
│ │ ├── post-form.service.ts (flat at root)                                                                                                                                                                                    │ │
│ │ ├── post-form.interface.ts (flat at root)                                                                                                                                                                                  │ │
│ │ ├── processed-post-data.interface.ts (flat at root)                                                                                                                                                                        │ │
│ │ ├── unsaved-changes.guard.ts (flat at root)                                                                                                                                                                                │ │
│ │ ├── add-post.constants.ts (keep flat)                                                                                                                                                                                      │ │
│ │ ├── add-image/ (component subfolder)                                                                                                                                                                                       │ │
│ │ │ ├── add-image.component.ts │ │
│ │ │ ├── add-image.component.html │ │
│ │ │ └── add-image-controls.interface.ts │ │
│ │ └── tag-multi-select/ (component subfolder)                                                                                                                                                                                │ │
│ │ ├── tag-multi-select.component.ts │ │
│ │ ├── tag-multi-select.component.html │ │
│ │ └── tag-multi-select.component.scss │ │
│ │ │ │
│ │ Phase 2: Fix Core Domain Structure │ │
│ │ │ │
│ │ Web App Core │ │
│ │ │ │
│ │ FROM:                                                                                                                                                                                                                        │ │
│ │ /core/ │ │
│ │ ├── services/ │ │
│ │ │ └── reader-api.service.ts │ │
│ │ └── utils/ │ │
│ │ └── prerender-params.ts │ │
│ │ │ │
│ │ TO:                                                                                                                                                                                                                          │ │
│ │ /core/ │ │
│ │ ├── core.ts │ │
│ │ ├── blog/ (domain folder)                                                                                                                                                                                                  │ │
│ │ │ └── reader-api.service.ts │ │
│ │ └── utils/ │ │
│ │ └── prerender-params.ts │ │
│ │ │ │
│ │ Phase 3: Extract Auth Pattern │ │
│ │ │ │
│ │ Create shared auth pattern with form logic:                                                                                                                                                                                  │ │
│ │ /projects/shared/src/pattern/auth/ │ │
│ │ ├── auth-form/ (new pattern component)                                                                                                                                                                                     │ │
│ │ │ ├── auth-form.component.ts │ │
│ │ │ ├── auth-form.component.html │ │
│ │ │ ├── auth-form.component.scss │ │
│ │ │ └── auth-form.service.ts │ │
│ │ ├── has-role.directive.ts (existing)                                                                                                                                                                                       │ │
│ │ └── index.ts │ │
│ │ │ │
│ │ Phase 4: Web UI Components Restructuring │ │
│ │ │ │
│ │ Since post-card and label are only used in web:                                                                                                                                                                              │ │
│ │ /projects/web/src/app/ui/ │ │
│ │ ├── post-card/ (keep in web, proper location)                                                                                                                                                                              │ │
│ │ │ ├── post-card.component.ts │ │
│ │ │ ├── post-card.component.html │ │
│ │ │ └── post-card.component.scss │ │
│ │ └── label/ (keep in web, proper location)                                                                                                                                                                                  │ │
│ │ ├── label.component.ts │ │
│ │ ├── label.component.html │ │
│ │ └── label.component.scss │ │
│ │ │ │
│ │ Phase 5: Shared Library Domain Organization │ │
│ │ │ │
│ │ Add proper domain structure to shared:                                                                                                                                                                                       │ │
│ │ /projects/shared/src/ │ │
│ │ ├── data-access/ │ │
│ │ │ ├── auth/ (domain)                                                                                                                                                                                                     │ │
│ │ │ │ └── auth.store.ts (move from stores/)                                                                                                                                                                              │ │
│ │ │ ├── blog/ (domain)                                                                                                                                                                                                     │ │
│ │ │ │ └── (blog-specific data access if needed)                                                                                                                                                                          │ │
│ │ │ ├── clients/ │ │
│ │ │ │ └── supabase.client.ts │ │
│ │ │ └── index.ts │ │
│ │ ├── pattern/ │ │
│ │ │ ├── auth/ │ │
│ │ │ │ ├── auth-form/ (new)                                                                                                                                                                                               │ │
│ │ │ │ └── has-role.directive.ts │ │
│ │ │ ├── dynamic-dialog/ │ │
│ │ │ └── index.ts │ │
│ │ ├── models/ (already domain-organized)                                                                                                                                                                                     │ │
│ │ ├── ui/ (pure presentational)                                                                                                                                                                                              │ │
│ │ └── utils/ (pure functions)                                                                                                                                                                                                │ │
│ │ │ │
│ │ Phase 6: Cleanup │ │
│ │ │ │
│ │ 1. Remove empty directories:                                                                                                                                                                                                 │ │
│ │ - /projects/admin/src/app/ui/ │ │
│ │ - /projects/shared/src/services/ │ │
│ │ - Any other empty folders after restructuring │ │
│ │ 2. Update all import paths throughout the codebase │ │
│ │ 3. Run build verification:                                                                                                                                                                                                   │ │
│ │ ng build web │ │
│ │ ng build admin │ │
│ │ ng build shared │ │
│ │ │ │
│ │ 🚀 Implementation Priority │ │
│ │ │ │
│ │ 1. High Priority (Architecture Violations)                                                                                                                                                                                   │ │
│ │ - Fix type-bucket folders in features │ │
│ │ - Restructure core to domain-first │ │
│ │ - Remove forbidden folder structures │ │
│ │ 2. Medium Priority (Code Reuse)                                                                                                                                                                                              │ │
│ │ - Extract auth pattern to shared │ │
│ │ - Organize shared library by domain │ │
│ │ - Clean up empty directories │ │
│ │ 3. Low Priority (Optimization)                                                                                                                                                                                               │ │
│ │ - Fine-tune component organization │ │
│ │ - Update documentation │ │
│ │ - Add missing tests │ │
│ │ │ │
│ │ ✅ Success Criteria │ │
│ │ │ │
│ │ - No type-bucket folders (components/, services/, stores/) in features │ │
│ │ - Core organized by domain, not by type │ │
│ │ - Shared library properly domain-organized │ │
│ │ - All apps build successfully │ │
│ │ - Import paths updated and working │ │
│ │ - No architecture.md violations remaining                        
