import { config as configure } from "dotenv-defaults"
import findConfig from "find-config"

import type { Config, Env, Output, Paths } from "./types"

/**
 * Paths to each `.env` file.
 *
 * @remarks
 * Contains both primary `.env` file and `.env.defaults` file if found.
 *
 * Will search any existing `process.env` values for explicit paths to load
 * under `DOTENV_PATH` and `DOTENV_DEFAULTS_PATH`. This can be useful if
 * providing custom environment variables to a child process for example.
 *
 * @public
 */
export const paths: Paths = {
  path: process.env.DOTENV_PATH ?? findConfig(".env") ?? undefined,
  defaults:
    process.env.DOTENV_DEFAULTS_PATH ?? findConfig(".env.defaults") ?? undefined
}

/**
 * Load values from resolved file paths.
 *
 * @remarks
 * Will return an empty object on `env` property if no values loaded, which
 * differs from parent `dotenv` output which returns undefined on `parsed`.
 *
 * @public
 */
export const load = <E extends Env>({
  filters,
  ...config
}: Config = {}): Output<E> => {
  const { parsed, error } = configure({
    ...paths,
    ...config
  })

  const env: E = Object.fromEntries(
    Object.entries(parsed ?? {}).filter(([key, value]) => {
      // Filter sensitive keys.
      if (filters && filters.some((filter) => key.match(filter))) {
        return false
      }

      // Strip empty values.
      return value !== ""
    })
  ) as E

  return {
    env,
    error
  }
}

/**
 * Immediately load initial values to allow inline import to function.
 *
 * @example
 * ```typescript
 * import "@nodesuite/env"
 * ```
 *
 * @public
 */
export const { env, error } = load()

/**
 * Export all custom types.
 *
 * @public
 */
export type { Config, Env, Output, Paths }
