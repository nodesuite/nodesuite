require("@rushstack/eslint-config/patch/modern-module-resolution")

const { ignorePatterns, parserOptions } = require("../options")

const {
  linesAroundComment,
  preferArrowFunctions,
  tsNamingConvention,
  simpleImportSort
} = require("../rules")

const {
  anyInTypes,
  barrels,
  javascript,
  markdown,
  schemas,
  typescript
} = require("../overrides")

const { when } = require("../utils")

/**
 * Node Eslint Config
 *
 * @public
 */
module.exports = {
  // Environment linter should expect.
  env: {
    node: true
  },
  // List of patterns to ignore.
  ignorePatterns,
  // Default parser options for TypeScript.
  parserOptions,
  // Third-party plugins to load.
  plugins: ["simple-import-sort", "prefer-arrow", "eslint-plugin-tsdoc"],
  // Main rules definitions across all included files.
  rules: {
    "@rushstack/no-new-null": "off",
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/naming-convention": ["warn", tsNamingConvention],
    "@typescript-eslint/no-floating-promises": when("test"),
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/typedef": "off",
    "arrow-body-style": ["error", "as-needed"],
    "block-spacing": "error",
    "import/order": "off",
    "lines-around-comment": ["error", linesAroundComment],
    "no-console": when("production"),
    "no-debugger": when("production"),
    "no-return-await": "error",
    "no-unused-vars": "off",
    "object-curly-spacing": ["error", "always"],
    "prefer-arrow/prefer-arrow-functions": ["error", preferArrowFunctions],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": ["error", simpleImportSort],
    "tsdoc/syntax": "error"
  },
  // Pattern specific overrides.
  overrides: [anyInTypes, barrels, javascript, markdown, schemas, typescript]
}
