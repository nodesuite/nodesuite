import type { KeyOf } from "@nodesuite/is"

import {
  findFilePath,
  readCliOptions,
  readEnvOptions,
  readFileOptions
} from "../sources"
import { extractKeys, pipe } from "../support"
import { parse } from "./parse"
import type { Options, RawOptions, Schema, Serializable } from "../types"

/**
 * Reads options from all sources in order of priority.
 *
 * @param schema - Deserialization schema for parsing options.
 */
export const configure = <S extends Schema>(schema: S): Options<S> => {
  // Extract keys from schema.
  const keys: KeyOf<S>[] = extractKeys(schema)

  // Read from all available sources as `camelCase` objects.
  // Each level is stripped of empty values to ensure key is explicitly free for next level.
  const cliOptions: RawOptions<KeyOf<S>> = readCliOptions(keys)
  const envOptions: RawOptions<KeyOf<S>> = readEnvOptions(keys)
  const filePath: string | undefined = findFilePath(cliOptions, envOptions)
  const fileOptions: RawOptions<KeyOf<S>> = readFileOptions(keys, filePath)

  // Merge options in order of priority.
  const rawOptions: RawOptions<KeyOf<S>> = {
    ...fileOptions,
    ...envOptions,
    ...cliOptions
  }

  // Build and parse each value according to the `Cast` or `Handler` defined in the schema.
  return pipe<S, Options<S>>(schema, (map, [key, cast]) => {
    // Avoid parsing inline to make debugging type errors clearer.
    const parsed: Serializable | undefined = parse(rawOptions[key], cast)
    return map.set(key, parsed)
  })
}
