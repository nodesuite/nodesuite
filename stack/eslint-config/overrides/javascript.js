module.exports = {
  files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
  parser: "espree",
  parserOptions: {
    ecmaVersion: 6
  },
  rules: {
    "@typescript-eslint/naming-convention": "off",
    "tsdoc/syntax": "off"
  }
}
