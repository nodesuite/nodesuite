import "dotenv-defaults/config"

import { camelCaseKeys } from "@nodesuite/case"

import { filter } from "../support"
import type { RawOptions } from "../types"

/**
 * Extracts environment variables via `dotenv-defaults`.
 *
 * @remarks
 * Loads env vars with `dotenv` and parses via a `CONSTANT_CASE` schema.
 *
 * Note: Take extra care when modifying any schema logic that may impact output type
 *  in unexpected ways as we assert the output type dangerously.
 *
 * @see https://github.com/mrsteele/dotenv-defaults
 *
 * @param keys - String array of keys from schema.
 *
 * @public
 */
export const readEnvOptions = <K extends string>(keys: K[]): RawOptions<K> => {
  const env: RawOptions = camelCaseKeys(process.env)
  return filter(env, keys) as RawOptions<K>
}
