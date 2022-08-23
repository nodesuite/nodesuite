<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/eslint-config

## Summary

An opinionated [eslint](https://eslint.org) config based on
the [@microsoft/rushstack](https://github.com/microsoft/rushstack/tree/main/eslint) monorepo
template.

# Installation

### Install dependencies

```shell
pnpm install @nodesuite/eslint-config @rushstack/eslint-config @typescript-eslint/parser
touch .eslintrc.js
```

### Setup local eslint config

```js
require("@rushstack/eslint-config/patch/modern-module-resolution")

module.exports = {
	extends: [
		"@rushstack/eslint-config/profile/node",
		"@rushstack/eslint-config/mixins/friendly-locals",
		"@nodesuite/eslint-config"
	],
	overrides: [
		// Add any overrides required for project...
	]
}
```

## Structure

- Configs: Top level configs for zero-config use.
- Options: Basic top level config options.
- Rules: Complex rule definitions.
- Overrides: Custom overrides for different scenarios.

## Highlights

- Uses separate parser for TS and JS files to avoid conflicts.
- Enforces `tsdoc` standard.
- Ignores comments on transient/generated barrel exports.
- Sorts imports and auto-fixes `type` prefix for `isolatedModules` compatibility.
- Sorts exports.
- Enforces a naming convention for TypeScript.
- Auto-fixes `function()` to `() => {}` arrow-functions.
- Enforces a specific number of lines around comments.
- Uses `markdown-eslint-parser` for markdown files.
- Disallows explicit `any` except in type definition files.
- Disables "heavy" rules such as `no-floating-promises` outside of CI.
- 