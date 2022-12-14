<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite

## Summary

A collection of utility packages for developing NodeJS TypeScript applications.

## Packages

- [`@nodesuite/abort`](https://github.com/nodesuite/nodesuite/tree/main/libraries/abort) Wrapper for native 
	`AbortController` utility.
- [`@nodesuite/case`](https://github.com/nodesuite/nodesuite/tree/main/libraries/case) String case utilities with type 
	transformers.
- [`@nodesuite/cli`](https://github.com/nodesuite/nodesuite/tree/main/libraries/cli) Simple command line class wrapper 
	with args parser.
- [`@nodesuite/convict`](https://github.com/nodesuite/nodesuite/tree/main/libraries/convict) Additional formats for 
	[Mozilla convict]() package.
- [`@nodesuite/crypto`](https://github.com/nodesuite/nodesuite/tree/main/libraries/crypto) Simplified native encryption 
	and decryption utilities.
- [`@nodesuite/defer`](https://github.com/nodesuite/nodesuite/tree/main/libraries/defer) Deferred Promise extractor.
- [`@nodesuite/delay`](https://github.com/nodesuite/nodesuite/tree/main/libraries/delay) Simple async timeout.
- [`@nodesuite/download`](https://github.com/nodesuite/nodesuite/tree/main/libraries/download) Zero-dependency file 
	download utility.
- [`@nodesuite/is`](https://github.com/nodesuite/nodesuite/tree/main/libraries/is) Runtime type checking with type 
	guards.
- [`@nodesuite/process`](https://github.com/nodesuite/nodesuite/tree/main/libraries/process) Enhanced Node 
	child-process management.
- [`@nodesuite/schemas`](https://github.com/nodesuite/nodesuite/tree/main/libraries/schemas) Commonly required 
	constants, 
	types, and `Zod` parsing schemas.
- [`@nodesuite/timer`](https://github.com/nodesuite/nodesuite/tree/main/libraries/timer) Simple performance timer 
	utility.
- [`@nodesuite/websocket`](https://github.com/nodesuite/nodesuite/tree/main/libraries/websocket) Asynchronous websocket 
	client.

## Development Tooling
- `@nodesuite/eslint-config` Opinionated eslint config builder.
- `@nodesuite/node-rig` Heft (Rush) monorepo rigging package for Node applications.

## Compatibility

Packages are intended for consumption by Node-based TypeScript projects and may not function as intended within a vanilla JavaScript or ESM-based project.

## Disclaimer / Warning
 
Packages are very early in development. Although used in some private projects, we do not recommend using in current state.