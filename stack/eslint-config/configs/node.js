require("@rushstack/eslint-config/patch/modern-module-resolution")

const {
  linesAroundComment,
  preferArrowFunctions,
  tsNamingConvention
} = require("../rules")

const when = (env) => (process.env.NODE_ENV === env ? "error" : "off")

module.exports = {
  env: {
    node: true
  },
  ignorePatterns: [
    "**/*.d.ts",
    "bin",
    "dist",
    "lib",
    "test",
    "vite",
    "tsup.config.ts"
  ],

  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  plugins: ["simple-import-sort", "prefer-arrow", "eslint-plugin-tsdoc"],
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
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^\\u0000"],
          ["^node:\\w", "^@?\\w", "^@?\\w.*\\u0000$"],
          ["(?<!\\u0000)$", "(?<=\\u0000)$"],
          ["^\\.", "^\\..*\\u0000$"]
        ]
      }
    ],
    "tsdoc/syntax": "error"
  },
  overrides: [
    {
      files: ["*.md"],
      parser: "markdown-eslint-parser"
    },
    {
      files: [
        "**/*-schema.ts",
        "**/schema.ts",
        "**/env.ts",
        "**/env/*.ts",
        "**/schemas.ts",
        "**/schemas/*.ts"
      ],
      rules: {
        "@rushstack/typedef-var": "off",
        "@rushstack/no-new-null": "off",
        "@typescript-eslint/typedef": "off"
      }
    },
    {
      files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 6
      },
      rules: {
        "@typescript-eslint/naming-convention": "off",
        "tsdoc/syntax": "off"
      }
    },
    {
      files: ["**/*.ts"],
      parserOptions: {
        project: ["./tsconfig.json"]
      },
      rules: {
        "@typescript-eslint/consistent-type-imports": ["error", { }],
        "@typescript-eslint/consistent-type-exports": ["error", { fixMixedExportsWithInlineTypeSpecifier: true }],
      }
    },
    {
      files: ["**/index.ts"],
      rules: {
        "tsdoc/syntax": "off"
      }
    },
    {
      files: ["**/types.ts", "**/types/*.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
