import { asString } from "@nodesuite/is"
import type { KeyOf } from "@nodesuite/is"

import { readCliOptions, readEnvOptions, readFileOptions } from "../sources"
import { extractConfigPath, extractKeys } from "../support"
import { parse } from "./parse"
import { pipe } from "./pipe"
import type { InferSchema, Options, RawOptions, Serializable } from "../types"

/**
 * Reads options from all sources in order of priority.
 *
 * @param schema - Deserialization schema for parsing options.
 *
 * @public
 */
export const configure = <
  O extends Options,
  S extends InferSchema<O> = InferSchema<O>
>(
  schema: S
): O => {
  // Define internal types.
  type Key = KeyOf<S>
  type Raw = RawOptions<Key>

  // Extract keys from schema.
  const keys: Key[] = extractKeys(schema)

  // Read from all available sources as `camelCase` objects.
  // Each level is stripped of empty values to ensure key is explicitly free for next level.
  const cliOptions: Raw = readCliOptions(keys)
  const envOptions: Raw = readEnvOptions(keys)

  // Existing options are searched for a "config" property.
  const filePath: string | undefined = extractConfigPath([
    cliOptions,
    envOptions
  ])
  const fileOptions: Raw = readFileOptions(keys, filePath)

  // Merge options in order of priority.
  const initialState: Raw = {
    ...fileOptions,
    ...envOptions,
    ...cliOptions
  }

  // Build and parse each value according to the `Cast` or `Handler` defined in the schema.
  return pipe<S, O>(
    schema,
    (map, [key, parser]) => {
      // The current "raw options" stack is passed as the starting state for the map, so all values are available unparsed as strings.
      const value: Serializable | undefined = map.get(key)
      // Use the keyed parser from the source schema to parse each value.
      const parsed: Serializable | undefined = parse(
        asString(key),
        value,
        parser
      )
      // Replace the unparsed value within the map.
      return map.set(key, parsed)
    },
    initialState
  )
}
