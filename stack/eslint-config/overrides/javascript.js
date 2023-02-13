module.exports = {
  files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
  parser: "espree",
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    "@typescript-eslint/naming-convention": "off",
    "lines-around-comment": "off",
    "semi-style": ["error", "last"],
    "tsdoc/syntax": "off"
  }
}
