require("@rushstack/eslint-config/patch/modern-module-resolution")

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/node",
    "@rushstack/eslint-config/mixins/friendly-locals",
    "@nodesuite/eslint-config"
  ],
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@rushstack/no-new-null": "off",
        "@typescript-eslint/ban-types": "off"
      }
    }
  ]
}
