<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/delay

Simple async timeout with optional randomization of range.

## Important

If no randomization is required, do not use this package.
Instead, use the Node built-in `setTimeout` from `node:timers/promises`.

https://nodejs.org/api/timers.html#timerspromisessettimeoutdelay-value-options

## Usage

```typescript
import { delay } from "@nodesuite/delay"

const example = async () => {
	const start = Date.now()
	await delay(1000, 2000)
	const stop = Date.now()
	console.log(`Randomized delay of ${stop - start}ms!`)
}
```
