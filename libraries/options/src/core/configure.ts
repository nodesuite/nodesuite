import { copy } from "copy-anything"
import { setProperty } from "dot-prop"

import { readCliOptions, readEnvOptions, readFileOptions } from "../sources"
import { extractConfigPath, extractKeys } from "../support"
import type { OptionsParser, PartialOptions, RawOptions } from "../types"

/**
 * Reads options from all sources in order of priority.
 *
 * @remarks
 * Reads from all available sources a flattened `camelCase` keyed records.
 * Importantly, the `defaults` object must contain all keys required in final output.
 * Each source is stripped of empty values to ensure key is explicitly free for next level.
 * All sources are merged in order, then used to inject into the original defaults object.
 *
 * @param defaults - Default values for the options. Must implement all keys.
 * @param parse - Abstract parser function which ensures values are cast as intended types.
 *
 * @public
 */
export const configure = <O extends object>(
  defaults: PartialOptions<O>,
  parse: OptionsParser<O>
): O => {
  // Create copy of source to avoid pollution of original.
  const options: PartialOptions<O> = copy(defaults)

  // Extract all deeply nested keys as dot notation strings.
  const keys: string[] = extractKeys(options)

  // Load command line arguments.
  const cliOptions: RawOptions = readCliOptions(keys)

  // Load environment variables.
  const envOptions: RawOptions = readEnvOptions(keys)

  // Existing options are searched for a "config" property.
  const filePath: string | undefined = extractConfigPath([
    cliOptions,
    envOptions
  ])

  // Load JSON/YAML file.
  const fileOptions: RawOptions = readFileOptions(keys, filePath)

  // Merge options in order of priority.
  const rawOptions: RawOptions = {
    ...fileOptions,
    ...envOptions,
    ...cliOptions
  }

  // Use flattened record to set values on the working object.
  for (const [key, value] of Object.entries(rawOptions)) {
    setProperty(options, key, value)
  }

  return parse(options)
}
