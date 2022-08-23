module.exports = {
  files: ["**/*.ts"],
  parserOptions: {
    project: ["./tsconfig.json"]
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": ["error", {}],
    "@typescript-eslint/consistent-type-exports": [
      "error",
      { fixMixedExportsWithInlineTypeSpecifier: true }
    ]
  }
}
