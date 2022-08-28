import { camelCaseKeys } from "@nodesuite/case"
import { isNotNullish } from "@nodesuite/is"
import type { AnyRecord } from "@nodesuite/is"

import { filter, readRawConfigFile } from "../support"
import type { RawOptions } from "../types"

/**
 * Extracts options from a target json file in filesystem.
 *
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
      return filter(content, keys) as RawOptions<K>
    }
  } catch (error) {
    // Report errors as warnings.
    console.warn((error as Error).message)
  }

  // If no path was provided, or reading failed, return empty partial.
  console.debug(`No config file provided, skipping.`)
  return {}
}

const hasFilePath = <O extends RawOptions<string>>(
  options: O
): options is O & { config: string } =>
  Object.keys(options).includes("config") &&
  isNotNullish((options as AnyRecord).config)

export const findFilePath = (
  ...allOptions: RawOptions<string>[]
): string | undefined => {
  for (const options of allOptions) {
    if (hasFilePath(options)) {
      return options.config
    }
  }
  return undefined
}
