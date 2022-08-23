<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/defer

## Summary

Simple deferred `Promise` generator.


## Installation
```shell
pnpm install @nodesuite/defer
```

## Usage

```typescript
import { defer } from "@nodesuite/defer"

import { someEventfulEmitter } from "./events"

const { resolve, reject, untilResolved } = defer()


// Define async work...
someEventfulEmitter.on("someEvent", resolve)

// ...or some alternative trigger...
const secondEmitter = new EventEmitter()
secondEmitter.on("secondEvent", resolve)

// ...or abstract resoltion conditons...
class Foo {
	
  #resolve
	#reject
  
	public constructor({ resolve, reject }) {
    this.#resolve = resolve
		this.#reject = reject
	}
  
  public someSuccessFunction() {
    return this.#resolve()
	}
  
  public someFailureFunction() {
    return this.#reject()
	}
  
}

const foo = new Foo({ resolve, reject })

// Reject the master promise...
someEventfulEmitter.on("error", () => foo.someFailureFunction())

// Can await resolution of promise from any source.
await untilResolved()



```