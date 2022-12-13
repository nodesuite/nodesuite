<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/abort

## Summary

Simplified wrapper for native `AbortController`.

## Install

```bash
# PNPM
pnpm install @nodesuite/abort
# Yarn
yarn install @nodesuite/abort
# NPM
npm install @nodesuite/abort
```

## Example

```typescript
import { Abort, type AbortManager } from "@nodesuite/abort"

const abort: AbortManager = new Abort()

// Less verbose listeners.
abort.onAbort(() => console.log(`Aborted!`))

// Feeback
const result: boolean | Error = abort.abort()

```

### Native `AbortController` Comparison

```typescript
const abort: AbortController = new AbortController()

// Complex listener defintion.
abort.signal.addEventListener("abort", () => console.log(`Aborted!`), {
	once: true
})

// No result feeback...
abort.abort()
```
