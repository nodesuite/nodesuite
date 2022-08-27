module.exports = {
  files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
  parser: "espree",
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    "@typescript-eslint/naming-convention": "off",
    "tsdoc/syntax": "off"
  }
}
