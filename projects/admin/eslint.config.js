// @ts-check
const path = require("path");
const tseslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

const tailwindSettings = {
  tailwindcss: {
    cssConfigPath: path.resolve(__dirname, "src/styles.css"),
  },
};

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
    settings: tailwindSettings,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "admin",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "admin",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    settings: tailwindSettings,
    rules: {},
  }
);
