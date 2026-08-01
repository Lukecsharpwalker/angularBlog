// @ts-check
const path = require('path');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const boundaries = require('eslint-plugin-boundaries');
const importPlugin = require('eslint-plugin-import');
const tailwindcss = require('eslint-plugin-tailwindcss');

const tailwindCssConfigPath = path.resolve(__dirname, 'projects/web/src/styles.css');
const tailwindSettings = {
  tailwindcss: {
    cssConfigPath: tailwindCssConfigPath,
  },
};
const tailwindClassnameWhitelist = [
  'tag-select-scroll',
  'hide-scrollbar',
  'quill-editor-theme',
];

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '.angular/**',
      '**/*.spec.ts',
      '**/e2e/**',
      '**/*.generated.ts',
      '**/*.d.ts',
      '!**/*.spec.d.ts',
      '*.config.js',
      '*.config.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      boundaries,
      import: importPlugin,
      tailwindcss,
    },
    settings: {
      ...tailwindSettings,
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.json', 'projects/*/tsconfig*.json'],
        },
      },
      'boundaries/dependency-nodes': ['import', 'dynamic-import'],
      'boundaries/elements': [
        { type: 'shared-lib', pattern: 'projects/shared/src/lib/**' },
        { type: 'shared-pattern', pattern: 'projects/shared/src/pattern/**' },
        { type: 'shared-core', pattern: 'projects/shared/src/core/**' },
        { type: 'shared-core-auth', pattern: 'projects/shared/src/core/auth/**' },
        { type: 'shared-core-blog', pattern: 'projects/shared/src/core/blog/**' },
        { type: 'shared-core-supabase', pattern: 'projects/shared/src/core/supabase/**' },
        { type: 'shared-data-access', pattern: 'projects/shared/src/data-access/**' },
        { type: 'shared-models', pattern: 'projects/shared/src/models/**' },
        { type: 'shared-models-api', mode: 'file', pattern: 'projects/shared/models/public-api.ts' },
        { type: 'shared-utils', pattern: 'projects/shared/src/utils/**' },
        { type: 'shared-utils-api', mode: 'file', pattern: 'projects/shared/src/utils/public-api.ts' },
        { type: 'shared-public-api', mode: 'file', pattern: 'projects/shared/src/public-api.ts' },
        { type: 'shared-external', mode: 'file', pattern: 'shared' },
        { type: 'web-main', mode: 'file', pattern: 'projects/web/src/main.ts' },
        { type: 'web-main-server', mode: 'file', pattern: 'projects/web/src/main.server.ts' },
        { type: 'web-server', mode: 'file', pattern: 'projects/web/src/server.ts' },
        { type: 'web-app', mode: 'file', pattern: 'projects/web/src/app/app*.ts' },
        { type: 'web-core', pattern: 'projects/web/src/app/core/**' },
        { type: 'web-layout', pattern: 'projects/web/src/app/layout/**' },
        { type: 'web-ui', pattern: 'projects/web/src/app/ui/**' },
        { type: 'web-pattern', pattern: 'projects/web/src/app/pattern/**' },
        {
          type: 'web-feature-routes',
          mode: 'file',
          pattern: 'projects/web/src/app/features/*/*.routes.ts',
          capture: ['feature'],
        },
        { type: 'web-feature', pattern: 'projects/web/src/app/features/**', capture: ['feature'] },
        { type: 'web-utils', pattern: 'projects/web/src/app/utils/**' },
        { type: 'admin-main', mode: 'file', pattern: 'projects/admin/src/main.ts' },
        { type: 'admin-app', mode: 'file', pattern: 'projects/admin/src/app/app*.ts' },
        { type: 'admin-core', pattern: 'projects/admin/src/app/core/**' },
        { type: 'admin-layout', pattern: 'projects/admin/src/app/layout/**' },
        { type: 'admin-ui', pattern: 'projects/admin/src/app/ui/**' },
        { type: 'admin-pattern', pattern: 'projects/admin/src/app/pattern/**' },
        { type: 'admin-utils', pattern: 'projects/admin/src/app/utils/**' },
        {
          type: 'admin-feature-routes',
          mode: 'file',
          pattern: 'projects/admin/src/app/features/*/*.routes.ts',
          capture: ['feature'],
        },
        {
          type: 'admin-feature',
          pattern: 'projects/admin/src/app/features/**',
          capture: ['feature'],
        },
        { type: 'mfe-main', mode: 'file', pattern: 'projects/code-samples-mfe/src/main.ts' },
        { type: 'mfe-app', mode: 'file', pattern: 'projects/code-samples-mfe/src/app/app*.ts' },
        { type: 'mfe-core', pattern: 'projects/code-samples-mfe/src/app/core/**' },
        { type: 'mfe-ui', pattern: 'projects/code-samples-mfe/src/app/ui/**' },
        {
          type: 'mfe-feature-routes',
          mode: 'file',
          pattern: 'projects/code-samples-mfe/src/app/features/*/*.routes.ts',
          capture: ['feature'],
        },
        {
          type: 'mfe-feature',
          pattern: 'projects/code-samples-mfe/src/app/features/**',
          capture: ['feature'],
        },
        { type: 'environment', pattern: '**/environments/**' },
      ],
      'boundaries/ignore': ['**/*.spec.ts', '**/e2e/**', '**/*.config.*'],
    },
    rules: {
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-signals': 'warn',
      'tailwindcss/no-custom-classname': ['warn', { whitelist: tailwindClassnameWhitelist }],
      'tailwindcss/no-arbitrary-value': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          selector: "CallExpression[callee.property.name='add'][callee.object.property.name='classList']",
          message: 'Do not add CSS classes from TypeScript. Styling belongs in templates or component stylesheets, not classList.add().',
        },
        {
          selector: "CallExpression[callee.property.name='remove'][callee.object.property.name='classList']",
          message: 'Do not remove CSS classes from TypeScript. Styling belongs in templates or component stylesheets, not classList.remove().',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index']],
          'newlines-between': 'never',
        },
      ],
      '@typescript-eslint/member-ordering': ['error', {
        default: [
          'signature',
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'public-constructor',
          'protected-constructor',
          'private-constructor',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
        ],
      }],
      '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'no-public',
        overrides: {
          accessors: 'no-public',
          constructors: 'no-public',
          methods: 'no-public',
          properties: 'no-public',
          parameterProperties: 'no-public',
        },
      }],
      'boundaries/no-unknown': 'error',
      'boundaries/no-private': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'shared-lib', allow: [] },
            { from: 'shared-pattern', allow: ['shared-models', 'shared-core', 'shared-core-auth', 'shared-core-blog', 'shared-core-supabase', 'shared-data-access', 'shared-public-api'] },
            { from: 'shared-core', allow: ['shared-models'] },
            { from: 'shared-core-auth', allow: ['shared-models', 'shared-core-supabase'] },
            { from: 'shared-core-blog', allow: ['shared-models', 'shared-core-auth', 'shared-core-supabase'] },
            { from: 'shared-core-supabase', allow: ['shared-models'] },
            { from: 'shared-data-access', allow: ['shared-models'] },
            { from: 'shared-models', allow: [] },
            { from: 'shared-models-api', allow: ['shared-models'] },
            { from: 'shared-utils', allow: [] },
            { from: 'shared-utils-api', allow: ['shared-utils'] },
            {
              from: 'shared-public-api',
              allow: [
                'shared-lib',
                'shared-pattern',
                'shared-core',
                'shared-core-auth',
                'shared-core-blog',
                'shared-core-supabase',
                'shared-data-access',
                'shared-models',
                'shared-utils',
              ],
            },
            { from: 'shared-external', allow: [] },

            { from: 'web-main', allow: ['web-app'] },
            { from: 'web-main-server', allow: ['web-app'] },
            { from: 'web-server', allow: ['web-app', 'shared-public-api'] },
            {
              from: 'web-app',
              allow: [
                'web-core',
                'web-layout',
                'web-feature-routes',
                'web-feature',
                'shared-public-api',
              ],
            },
            { from: 'web-core', allow: ['web-utils', 'shared-public-api', 'shared-core', 'shared-core-auth', 'shared-core-blog', 'shared-core-supabase', 'environment'] },
            {
              from: 'web-layout',
              allow: ['web-core', 'web-ui', 'shared-pattern', 'shared-public-api', 'shared-core'],
            },
            { from: 'web-ui', allow: ['shared-models', 'shared-models-api'] },
            {
              from: 'web-pattern',
              allow: ['web-core', 'web-ui', 'shared-pattern', 'shared-public-api', 'shared-core'],
            },
            {
              from: 'web-feature',
              allow: ['web-core', 'web-ui', 'web-pattern', 'web-utils', 'shared-public-api', 'shared-models-api', 'shared-core', 'shared-core-auth', 'shared-core-blog', 'shared-core-supabase', 'shared-pattern'],
            },
            { from: 'web-feature-routes', allow: ['web-core', 'web-pattern', 'web-feature'] },
            { from: 'web-utils', allow: ['shared-models', 'shared-public-api', 'shared-core', 'shared-core-supabase', 'environment'] },

            { from: 'admin-main', allow: ['admin-app'] },
            {
              from: 'admin-app',
              allow: ['admin-core', 'admin-layout', 'admin-feature-routes', 'shared-public-api'],
            },
            { from: 'admin-core', allow: ['shared-public-api', 'shared-core', 'shared-core-auth', 'shared-core-blog', 'shared-core-supabase', 'environment'] },
            {
              from: 'admin-layout',
              allow: ['admin-core', 'admin-ui', 'shared-pattern', 'shared-public-api', 'shared-core'],
            },
            { from: 'admin-ui', allow: ['shared-models', 'shared-models-api'] },
            {
              from: 'admin-pattern',
              allow: ['admin-core', 'admin-ui', 'shared-pattern', 'shared-public-api'],
            },
            { from: 'admin-utils', allow: ['shared-models', 'shared-public-api', 'environment'] },
            {
              from: 'admin-feature',
              allow: ['admin-core', 'admin-ui', 'admin-pattern', 'admin-utils', 'shared-public-api', 'shared-core', 'shared-core-auth', 'shared-core-blog', 'shared-core-supabase', 'shared-pattern'],
            },
            {
              from: 'admin-feature-routes',
              allow: ['admin-core', 'admin-pattern', 'admin-feature'],
            },

            { from: 'mfe-main', allow: ['mfe-app'] },
            { from: 'mfe-app', allow: ['mfe-core', 'mfe-feature-routes', 'shared-public-api'] },
            { from: 'mfe-core', allow: ['shared-public-api'] },
            { from: 'mfe-ui', allow: ['shared-models', 'shared-models-api'] },
            { from: 'mfe-feature', allow: ['mfe-core', 'mfe-ui', 'shared-public-api'] },
            { from: 'mfe-feature-routes', allow: ['mfe-core', 'mfe-feature'] },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    plugins: {
      tailwindcss,
    },
    settings: {
      ...tailwindSettings,
    },
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      'tailwindcss/no-custom-classname': ['warn', { whitelist: tailwindClassnameWhitelist }],
      'tailwindcss/no-arbitrary-value': 'warn',
    },
  },
  {
    files: ['projects/web/src/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['web', 'shared'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['web', 'shared'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['projects/admin/src/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['admin', 'shared'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['admin', 'shared'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['projects/code-samples-mfe/src/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['mfe', 'shared'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['mfe', 'shared'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['projects/shared/src/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'shared',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'shared',
          style: 'kebab-case',
        },
      ],
    },
  }
);
