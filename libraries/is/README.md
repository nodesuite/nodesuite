<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/is

## Summary

Runtime checking of JavaScript variable types with TypeScript
[type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Credit

Many of the definitions within this package are sourced or modified from the
original [sindresorhus/is](https://github.com/sindresorhus/is) library.

Additionally, the type guard system leans heavily on
the [sindresorhus/type-fest](https://github.com/sindresorhus/type-fest) library by the same author.

Importantly, the api surfaces of the two packages are fundamentally different so care should be
taken to not attempt to use the same functions expecting the same result. 