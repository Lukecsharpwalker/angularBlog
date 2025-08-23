// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const boundaries = require("eslint-plugin-boundaries");
const importPlugin = require("eslint-plugin-import");

module.exports = tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**", 
      "coverage/**",
      ".angular/**",
      "src/**",
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
      boundaries,
      import: importPlugin
    },
    settings: {
      "import/resolver": {
        "typescript": {
          "alwaysTryTypes": true,
          "project": ["tsconfig.json", "projects/*/tsconfig*.json"]
        }
      },
      "boundaries/dependency-nodes": ["import", "dynamic-import"],
      "boundaries/elements": [
        { type: "shared-lib", pattern: "projects/shared/src/lib/**" },
        { type: "shared-ui", pattern: "projects/shared/src/ui/**" },
        { type: "shared-pattern", pattern: "projects/shared/src/pattern/**" },
        { type: "shared-services", pattern: "projects/shared/src/services/**" },
        { type: "shared-data-access", pattern: "projects/shared/src/data-access/**" },
        { type: "shared-models", pattern: "projects/shared/src/models/**" },
        { type: "shared-utils", pattern: "projects/shared/src/utils/**" },
        { type: "shared-public-api", mode: "file", pattern: "projects/shared/src/public-api.ts" },
        { type: "shared-external", mode: "file", pattern: "shared" },
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
        { type: "admin-main", mode: "file", pattern: "projects/admin/src/main.ts" },
        { type: "admin-app", mode: "file", pattern: "projects/admin/src/app/app*.ts" },
        { type: "admin-core", pattern: "projects/admin/src/app/core/**" },
        { type: "admin-layout", pattern: "projects/admin/src/app/layout/**" },
        { type: "admin-ui", pattern: "projects/admin/src/app/ui/**" },
        { type: "admin-pattern", pattern: "projects/admin/src/app/pattern/**" },
        { type: "admin-feature-routes", mode: "file", pattern: "projects/admin/src/app/features/*/*.routes.ts", capture: ["feature"] },
        { type: "admin-feature", pattern: "projects/admin/src/app/features/**", capture: ["feature"] },
        { type: "mfe-main", mode: "file", pattern: "projects/code-samples-mfe/src/main.ts" },
        { type: "mfe-app", mode: "file", pattern: "projects/code-samples-mfe/src/app/app*.ts" },
        { type: "mfe-core", pattern: "projects/code-samples-mfe/src/app/core/**" },
        { type: "mfe-ui", pattern: "projects/code-samples-mfe/src/app/ui/**" },
        { type: "mfe-feature-routes", mode: "file", pattern: "projects/code-samples-mfe/src/app/features/*/*.routes.ts", capture: ["feature"] },
        { type: "mfe-feature", pattern: "projects/code-samples-mfe/src/app/features/**", capture: ["feature"] },
        { type: "environment", pattern: "**/environments/**" }
      ],
      "boundaries/ignore": [
        "**/*.spec.ts",
        "**/e2e/**",
        "**/*.config.*"
      ]
    },
    rules: {
      "@angular-eslint/prefer-standalone": "error",
      "@angular-eslint/prefer-signals": "warn",
      "import/order": ["error", {
        "groups": [
          "builtin",
          "external", 
          ["internal", "parent", "sibling", "index"]
        ],
        "newlines-between": "never"
      }],
      "boundaries/no-unknown": "error", 
      "boundaries/no-private": "error", 
      "boundaries/no-unknown-files": "error",
      "boundaries/element-types": ["error", {
        default: "disallow",
        rules: [
          { from: "shared-lib", allow: [] },
          { from: "shared-ui", allow: ["shared-models"] },
          { from: "shared-pattern", allow: ["shared-ui", "shared-models", "shared-utils"] },
          { from: "shared-services", allow: ["shared-models", "shared-utils"] },
          { from: "shared-data-access", allow: ["shared-models"] },
          { from: "shared-models", allow: [] },
          { from: "shared-utils", allow: [] },
          { from: "shared-public-api", allow: ["shared-lib", "shared-ui", "shared-pattern", "shared-services", "shared-data-access", "shared-models", "shared-utils"] },
          { from: "shared-external", allow: [] },

          { from: "web-main", allow: ["web-app"] },
          { from: "web-main-server", allow: ["web-app"] },
          { from: "web-server", allow: ["web-app", "shared-public-api"] },
          { from: "web-app", allow: ["web-core", "web-layout", "web-feature-routes", "web-feature", "shared-public-api"] },
          { from: "web-core", allow: ["shared-public-api", "environment"] },
          { from: "web-layout", allow: ["web-core", "shared-ui", "shared-pattern", "shared-public-api"] },
          { from: "web-ui", allow: ["shared-ui", "shared-models"] },
          { from: "web-pattern", allow: ["web-core", "shared-ui", "shared-pattern", "shared-public-api"] },
          { from: "web-feature", allow: ["web-core", "web-ui", "web-pattern", "shared-public-api"] },
          { from: "web-feature-routes", allow: ["web-core", "web-pattern", "web-feature"] },

          { from: "admin-main", allow: ["admin-app"] },
          { from: "admin-app", allow: ["admin-core", "admin-layout", "admin-feature-routes", "shared-public-api"] },
          { from: "admin-core", allow: ["shared-public-api", "environment"] },
          { from: "admin-layout", allow: ["admin-core", "shared-ui", "shared-pattern", "shared-public-api"] },
          { from: "admin-ui", allow: ["shared-ui", "shared-models"] },
          { from: "admin-pattern", allow: ["admin-core", "shared-ui", "shared-pattern", "shared-public-api"] },
          { from: "admin-feature", allow: ["admin-core", "admin-ui", "admin-pattern", "shared-public-api"] },
          { from: "admin-feature-routes", allow: ["admin-core", "admin-pattern", "admin-feature"] },

          { from: "mfe-main", allow: ["mfe-app"] },
          { from: "mfe-app", allow: ["mfe-core", "mfe-feature-routes", "shared-public-api"] },
          { from: "mfe-core", allow: ["shared-public-api"] },
          { from: "mfe-ui", allow: ["shared-ui", "shared-models"] },
          { from: "mfe-feature", allow: ["mfe-core", "mfe-ui", "shared-public-api"] },
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
  {
    files: ["projects/web/src/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["web", "shared"],
          style: "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error", 
        {
          type: "element",
          prefix: ["web", "shared"],
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
          prefix: ["admin", "shared"],
          style: "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["admin", "shared"],
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
          prefix: ["mfe", "shared"],
          style: "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["mfe", "shared"],
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