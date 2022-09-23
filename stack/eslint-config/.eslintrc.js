require("@rushstack/eslint-config/patch/modern-module-resolution")

module.exports = {
  extends: [
    "@rushstack/eslint-config/mixins/friendly-locals",
    "@rushstack/eslint-config/profile/web-app",
    "./profile/node.js"
  ],
  overrides: [
    {
      files: ["profile/*.js"],
      rules: {
        "lines-around-comment": "off"
      }
    }
  ]
}
