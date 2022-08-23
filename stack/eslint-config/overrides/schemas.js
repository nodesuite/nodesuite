module.exports = {
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
}
