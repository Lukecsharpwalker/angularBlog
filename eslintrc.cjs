/* .eslintrc.cjs — boundaries for angular.fun monorepo
 * Layers per app: core, layout, ui, pattern, data-access, feature (lazy)
 * Shared libs: shared/ui, shared/pattern, shared/data-access
 */
/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: ['**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      plugins: ['boundaries'],
      settings: {
        'boundaries/elements': [
          // ---- Shared libs ----
          { type: 'shared-ui', pattern: 'libs/shared/ui/**' },
          { type: 'shared-pattern', pattern: 'libs/shared/pattern/**' },
          { type: 'shared-data', pattern: 'libs/shared/data-access/**' },

          // ---- Apps: blog-ssg ----
          { type: 'blog-core', pattern: 'apps/blog-ssg/src/app/core/**' },
          { type: 'blog-layout', pattern: 'apps/blog-ssg/src/app/layout/**' },
          { type: 'blog-ui', pattern: 'apps/blog-ssg/src/app/ui/**' },
          { type: 'blog-pattern', pattern: 'apps/blog-ssg/src/app/pattern/**' },
          { type: 'blog-data', pattern: 'apps/blog-ssg/src/app/data-access/**' },
          { type: 'blog-feature', pattern: 'apps/blog-ssg/src/app/feature/**' },

          // ---- Apps: admin-spa ----
          { type: 'admin-core', pattern: 'apps/admin-spa/src/app/core/**' },
          { type: 'admin-layout', pattern: 'apps/admin-spa/src/app/layout/**' },
          { type: 'admin-ui', pattern: 'apps/admin-spa/src/app/ui/**' },
          { type: 'admin-pattern', pattern: 'apps/admin-spa/src/app/pattern/**' },
          { type: 'admin-data', pattern: 'apps/admin-spa/src/app/data-access/**' },
          { type: 'admin-feature', pattern: 'apps/admin-spa/src/app/feature/**' },

          // ---- Apps: code-samples-mfe ----
          { type: 'samples-core', pattern: 'apps/code-samples-mfe/src/app/core/**' },
          { type: 'samples-layout', pattern: 'apps/code-samples-mfe/src/app/layout/**' },
          { type: 'samples-ui', pattern: 'apps/code-samples-mfe/src/app/ui/**' },
          { type: 'samples-pattern', pattern: 'apps/code-samples-mfe/src/app/pattern/**' },
          { type: 'samples-data', pattern: 'apps/code-samples-mfe/src/app/data-access/**' },
          { type: 'samples-feature', pattern: 'apps/code-samples-mfe/src/app/feature/**' }
        ],
      },
      rules: {
        // Prevent unknown files from bypassing the rules
        'boundaries/no-unknown-files': 'error',

        // Forbid private imports across elements
        'boundaries/no-private': 'error',

        // Allowed import graph
        'boundaries/allowed-types': ['error', [
          // Shared layers
          { from: ['shared-ui'], allow: [] },
          { from: ['shared-pattern'], allow: ['shared-ui'] },
          { from: ['shared-data'], allow: [] },

          // blog-ssg
          { from: ['blog-core'], allow: ['shared-data'] },
          { from: ['blog-layout'], allow: ['blog-core', 'shared-ui', 'shared-pattern'] },
          { from: ['blog-ui'], allow: ['shared-ui'] },
          { from: ['blog-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data'] },
          { from: ['blog-data'], allow: ['shared-data'] },
          { from: ['blog-feature'], allow: ['blog-core', 'blog-layout', 'blog-ui', 'blog-pattern', 'blog-data', 'shared-ui', 'shared-pattern', 'shared-data'] },

          // admin-spa
          { from: ['admin-core'], allow: ['shared-data'] },
          { from: ['admin-layout'], allow: ['admin-core', 'shared-ui', 'shared-pattern'] },
          { from: ['admin-ui'], allow: ['shared-ui'] },
          { from: ['admin-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data'] },
          { from: ['admin-data'], allow: ['shared-data'] },
          { from: ['admin-feature'], allow: ['admin-core', 'admin-layout', 'admin-ui', 'admin-pattern', 'admin-data', 'shared-ui', 'shared-pattern', 'shared-data'] },

          // samples-mfe
          { from: ['samples-core'], allow: ['shared-data'] },
          { from: ['samples-layout'], allow: ['samples-core', 'shared-ui', 'shared-pattern'] },
          { from: ['samples-ui'], allow: ['shared-ui'] },
          { from: ['samples-pattern'], allow: ['shared-ui', 'shared-pattern', 'shared-data'] },
          { from: ['samples-data'], allow: ['shared-data'] },
          { from: ['samples-feature'], allow: ['samples-core', 'samples-layout', 'samples-ui', 'samples-pattern', 'samples-data', 'shared-ui', 'shared-pattern', 'shared-data'] }
        ]],

        // Enforce public APIs (optional): only import from directories' public entry points
        // 'boundaries/entry-point': ['error', [{ target: 'always', from: ['shared-ui', 'shared-pattern', 'shared-data'] }]]
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {}
    }
  ]
};
