require("@rushstack/eslint-config/patch/modern-module-resolution")

module.exports = {
  extends: [
    "@rushstack/eslint-config/mixins/friendly-locals",
    "@rushstack/eslint-config/profile/web-app",
    "./configs/node.js"
  ]
}
