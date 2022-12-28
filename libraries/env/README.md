<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/env

Simple environment `.env` file parser with recursive search.

## Background

In nearly every case, I would suggest using the excellent `dotenv` family of libraries as they are well maintained
and better supported:

- []()
- [dotenv-defaults](https://github.com/mrsteele/dotenv-defaults)
- []()

## Primary Use-Cases

The primary reasons for creating this package are the following scenarios where `dotenv` loses contact with the
location of the intended `.env` files:

1. When bundling and packaging a Node application as a binary, as the final executable may be moved around the
   end-user's filesystem in unpredictable locations.
2. When working within a monorepo, `dotenv` is sometimes unable to locate the correct file when deeply nested.

Although the `dotenv` family of libraries allow specifying a location of the file, this package handles locating the
file when the location is unknown.

Importantly, the primary concern is loading `.env` files into `process.env` as opposed to acting as a full
configuration manager.

It can be used prior to initialization of a larger configuration package such as
[mozilla/node-convict](https://github.com/mozilla/node-convict) or [nconf](https://github.com/indexzero/nconf) in
edge-cases where `.env` files cannot be located by the main library.

## Additional Use-Cases

Additional use-cases this package handles are:

- Passing a specific `.env` file path for an arbitrary location to a child process using explicit environment variables.
- When called manually, allows filtering of sensitive keys with string or regex pattern.

## Usage

### Inline

Example usage alongside `convict`:

```typescript
import "@nodesuite/env"

import convict from "convict"

const config = convict({
	env: {
		doc: "The application environment (always in process.env).",
		format: ["development", "test", "production"],
		default: "development",
		env: "NODE_ENV"
	},
	foo: {
		doc: "Example variable (loaded from .env file).",
		format: Boolean,
		default: false,
		env: "FOO"
	}
})
```

### Manual

```typescript
import { load , type Env} from "@nodesuite/env"

interface MyEnv extends Env {
  MY_SAFE_VALUE?: string
	MY_UNSAFE_VALUE: never
	RANDOM_API_KEY: never

}
const { env } = load({
	filters: ["MY_UNSAFE_VALUE", /API_KEY/g]
})

```
