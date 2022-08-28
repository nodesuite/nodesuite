import { camelCaseKeys } from "@nodesuite/case"

import { filter, readRawConfigFile } from "../support"
import type { RawOptions } from "../types"

/**
 * Extracts options from a target json file in filesystem.
 *
 * @param keys - String array of keys from schema.
 * @param path - Path to file config if available.
 *
 * @public
 */
export const readFileOptions = <K extends string>(
  keys: K[],
  path?: string
): RawOptions<K> => {
  try {
    // Test if a valid path was provided.
    if (path) {
      const content: RawOptions<K> = camelCaseKeys(readRawConfigFile(path))

      // Read the source file and ensure all keys are camelCase.
      return filter(content, keys)
    }
  } catch (error) {
    // Report errors as warnings.
    console.warn((error as Error).message)
  }

  // If no path was provided, or reading failed, return empty partial.
  console.debug(`No config file provided, skipping.`)
  return {}
}
