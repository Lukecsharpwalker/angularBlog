// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const boundaries = require("eslint-plugin-boundaries");

module.exports = tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**", 
      "coverage/**",
      ".angular/**",
      "src/**", // Exclude legacy monolith during migration
      "**/*.spec.ts",
      "**/e2e/**",
      "**/*.generated.ts",
      "**/*.d.ts",
      "!**/*.spec.d.ts",
      "*.config.js",
      "*.config.ts"
    ]
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      boundaries
    },
    settings: {
      "import/resolver": {
        "typescript": {
          "alwaysTryTypes": true
        }
      },
      "boundaries/dependency-nodes": ["import", "dynamic-import"],
      "boundaries/elements": [
        // Shared library elements
        { type: "shared-lib", pattern: "projects/shared/src/lib/**" },
        { type: "shared-ui", pattern: "projects/shared/src/ui/**" },
        { type: "shared-pattern", pattern: "projects/shared/src/pattern/**" },
        { type: "shared-data-access", pattern: "projects/shared/src/data-access/**" },
        { type: "shared-models", pattern: "projects/shared/src/models/**" },
        { type: "shared-utils", pattern: "projects/shared/src/utils/**" },
        { type: "shared-public-api", mode: "file", pattern: "projects/shared/src/public-api.ts" },

        // Web app elements
        { type: "web-main", mode: "file", pattern: "projects/web/src/main.ts" },
        { type: "web-main-server", mode: "file", pattern: "projects/web/src/main.server.ts" },
        { type: "web-server", mode: "file", pattern: "projects/web/src/server.ts" },
        { type: "web-app", mode: "file", pattern: "projects/web/src/app/app*.ts" },
        { type: "web-core", pattern: "projects/web/src/app/core/**" },
        { type: "web-layout", pattern: "projects/web/src/app/layout/**" },
        { type: "web-ui", pattern: "projects/web/src/app/ui/**" },
        { type: "web-pattern", pattern: "projects/web/src/app/pattern/**" },
        { type: "web-feature-routes", mode: "file", pattern: "projects/web/src/app/features/*/*.routes.ts", capture: ["feature"] },
        { type: "web-feature", pattern: "projects/web/src/app/features/**", capture: ["feature"] },

        // Admin app elements  
        { type: "admin-main", mode: "file", pattern: "projects/admin/src/main.ts" },
        { type: "admin-app", mode: "file", pattern: "projects/admin/src/app/app*.ts" },
        { type: "admin-core", pattern: "projects/admin/src/app/core/**" },
        { type: "admin-layout", pattern: "projects/admin/src/app/layout/**" },
        { type: "admin-ui", pattern: "projects/admin/src/app/ui/**" },
        { type: "admin-pattern", pattern: "projects/admin/src/app/pattern/**" },
        { type: "admin-feature-routes", mode: "file", pattern: "projects/admin/src/app/features/*/*.routes.ts", capture: ["feature"] },
        { type: "admin-feature", pattern: "projects/admin/src/app/features/**", capture: ["feature"] },

        // MFE app elements
        { type: "mfe-main", mode: "file", pattern: "projects/code-samples-mfe/src/main.ts" },
        { type: "mfe-app", mode: "file", pattern: "projects/code-samples-mfe/src/app/app*.ts" },
        { type: "mfe-core", pattern: "projects/code-samples-mfe/src/app/core/**" },
        { type: "mfe-ui", pattern: "projects/code-samples-mfe/src/app/ui/**" },
        { type: "mfe-feature-routes", mode: "file", pattern: "projects/code-samples-mfe/src/app/features/*/*.routes.ts", capture: ["feature"] },
        { type: "mfe-feature", pattern: "projects/code-samples-mfe/src/app/features/**", capture: ["feature"] }
      ],
      "boundaries/ignore": [
        "**/*.spec.ts",
        "**/e2e/**",
        "**/*.config.*"
      ]
    },
    rules: {
      // Angular 20+ specific rules
      "@angular-eslint/prefer-standalone": "error",
      "@angular-eslint/prefer-signals": "warn",
      
      // Boundaries enforcement
      "boundaries/no-unknown": "error",
      "boundaries/no-private": "error", 
      "boundaries/no-unknown-files": "error", 
      "boundaries/element-types": ["error", {
        default: "disallow",
        rules: [
          // Shared library rules
          { from: "shared-lib", allow: [] },
          { from: "shared-ui", allow: ["shared-models"] },
          { from: "shared-pattern", allow: ["shared-ui", "shared-models", "shared-utils"] },
          { from: "shared-data-access", allow: ["shared-models"] },
          { from: "shared-models", allow: [] },
          { from: "shared-utils", allow: [] },
          { from: "shared-public-api", allow: ["shared-lib", "shared-ui", "shared-pattern", "shared-data-access", "shared-models", "shared-utils"] },

          // Web app rules
          { from: "web-main", allow: ["web-app"] },
          { from: "web-main-server", allow: ["web-app"] },
          { from: "web-server", allow: ["web-app", "shared-public-api"] },
          { from: "web-app", allow: ["web-core", "web-layout", "web-feature-routes", "shared-public-api"] },
          { from: "web-core", allow: ["shared-data-access", "shared-models", "shared-utils"] },
          { from: "web-layout", allow: ["web-core", "shared-ui", "shared-pattern", "shared-models"] },
          { from: "web-ui", allow: ["shared-ui", "shared-models"] },
          { from: "web-pattern", allow: ["shared-ui", "shared-pattern", "shared-data-access", "shared-models", "shared-utils"] },
          { from: "web-feature", allow: ["web-core", "web-layout", "web-ui", "web-pattern", "shared-ui", "shared-pattern", "shared-data-access", "shared-models", "shared-utils"] },
          { from: "web-feature-routes", allow: ["web-core", "web-pattern", "web-feature"] },

          // Admin app rules
          { from: "admin-main", allow: ["admin-app"] },
          { from: "admin-app", allow: ["admin-core", "admin-layout", "admin-feature-routes", "shared-public-api"] },
          { from: "admin-core", allow: ["shared-data-access", "shared-models", "shared-utils"] },
          { from: "admin-layout", allow: ["admin-core", "shared-ui", "shared-pattern", "shared-models"] },
          { from: "admin-ui", allow: ["shared-ui", "shared-models"] },
          { from: "admin-pattern", allow: ["shared-ui", "shared-pattern", "shared-data-access", "shared-models", "shared-utils"] },
          { from: "admin-feature", allow: ["admin-core", "admin-layout", "admin-ui", "admin-pattern", "shared-ui", "shared-pattern", "shared-data-access", "shared-models", "shared-utils"] },
          { from: "admin-feature-routes", allow: ["admin-core", "admin-pattern", "admin-feature"] },

          // MFE app rules
          { from: "mfe-main", allow: ["mfe-app"] },
          { from: "mfe-app", allow: ["mfe-core", "mfe-feature-routes", "shared-public-api"] },
          { from: "mfe-core", allow: ["shared-data-access", "shared-models", "shared-utils"] },
          { from: "mfe-ui", allow: ["shared-ui", "shared-models"] },
          { from: "mfe-feature", allow: ["mfe-core", "mfe-ui", "shared-ui", "shared-pattern", "shared-data-access", "shared-models", "shared-utils"] },
          { from: "mfe-feature-routes", allow: ["mfe-core", "mfe-feature"] }
        ]
      }]
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/prefer-control-flow": "error",
      "@angular-eslint/template/prefer-self-closing-tags": "error"
    }
  },
  // Project-specific overrides
  {
    files: ["projects/web/src/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "web",
          style: "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error", 
        {
          type: "element",
          prefix: "web",
          style: "kebab-case"
        }
      ]
    }
  },
  {
    files: ["projects/admin/src/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute", 
          prefix: "admin",
          style: "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "admin", 
          style: "kebab-case"
        }
      ]
    }
  },
  {
    files: ["projects/code-samples-mfe/src/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "mfe",
          style: "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "mfe",
          style: "kebab-case"
        }
      ]
    }
  },
  {
    files: ["projects/shared/src/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "shared",
          style: "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element", 
          prefix: "shared",
          style: "kebab-case"
        }
      ]
    }
  }
);