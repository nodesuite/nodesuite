"use strict"
require("@rushstack/eslint-config/patch/modern-module-resolution")

const { ignorePatterns, parserOptions, plugins } = require("../options")

const {
  linesAroundComment,
  preferArrowFunctions,
  preventAbbreviations,
  tsNamingConvention,
  simpleImportSort
} = require("../rules")

const {
  anyInTypes,
  barrels,
  javascript,
  markdown,
  typeDefinitions,
  typescript
} = require("../overrides")

const { when } = require("../utils")

/**
 * NodeJS ESLint profile.
 *
 * @remarks
 * This profile is intended for use within NodeJS applications.
 * Rules may not be appropriate for browser applications.
 *
 * @public
 */
module.exports = {
  /* Environment linter should expect. */
  env: {
    node: true
  },
  /* List of patterns to ignore. */
  ignorePatterns,
  /* Default parser options for TypeScript. */
  parserOptions,
  /* Third-party plugins to load. */
  plugins,
  /* Main rule definitions used across all matched files. */
  rules: {
    "@rushstack/no-new-null": "warn",
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/naming-convention": ["warn", tsNamingConvention],
    "@typescript-eslint/no-floating-promises": when("test"),
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/typedef": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "arrow-body-style": ["error", "as-needed"],
    "block-spacing": "error",
    "filename-rules/match": [2, /^[a-z0-9.-]+$/],
    "folders/match-regex": [2, "^[a-z0-9-]+$", "/src/**"],
    "import/order": "off",
    "lines-around-comment": ["error", linesAroundComment],
    "no-console": when("production"),
    "no-debugger": when("production"),
    "no-return-await": "off",
    "no-unused-vars": "off",
    "object-curly-spacing": ["error", "always"],
    "prefer-arrow/prefer-arrow-functions": ["error", preferArrowFunctions],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": ["error", simpleImportSort],
    "tsdoc/syntax": "error",
    "unicorn/catch-error-name": "error",
    "unicorn/custom-error-definition": "error",
    "unicorn/filename-case": "error",
    "unicorn/prefer-switch": "error",
    "unicorn/prefer-spread": "error"
  },
  /* Pattern specific overrides.  */
  overrides: [
    anyInTypes,
    barrels,
    javascript,
    markdown,
    typeDefinitions,
    typescript
  ]
}
