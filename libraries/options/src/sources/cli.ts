import { camelCaseKeys, paramCase } from "@nodesuite/case"
import arg from "arg"
import type { Spec } from "arg"

import { filter } from "../support"
import type { RawOptions } from "../types"

/**
 * Extracts any command line arguments from argv.
 *
 * @remarks
 * The Vercel `arg` package assumes that arguments are:
 *  1. Always prefixed with `--`.
 *  2. Set using a `=` string character with no whitespace.
 *
 * The `--` prefix is stripped during conversion to `camelCase` and nullish values are removed.
 * All non-matching keys are pushed to the `_` property in case they are required.
 * Values are always returned as strings from argv.
 *
 * @see https://github.com/vercel/arg
 *
 * @param keys - String array of keys from schema.
 *
 * @public
 */
export const readCliOptions = <K extends string>(keys: K[]): RawOptions<K> => {
  // Define Vercel arg spec.
  const spec: Spec = Object.fromEntries(
    keys.map(([key]) => [paramCase(key), String])
  )

  // Extract args from argv.
  const { _, ...argv } = arg(spec, { permissive: true })

  // Convert from --param-case to camelCase and filter nullish values.
  const args: RawOptions = camelCaseKeys(argv)

  // Append all unexpected keys.
  return { ...filter(args, keys), _ } as RawOptions<K>
}
