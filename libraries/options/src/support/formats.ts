import { asString } from "@nodesuite/is"
import { parse } from "yaml"
import type { AnyRecord } from "@nodesuite/is"

import type { Reviver } from "../types"

/**
 * JSON reviver that forces all values to strings.
 *
 * @param _k - Property key.
 * @param value - Property value.
 *
 * @internal
 */
const reviver: Reviver = (_k: unknown, value: unknown) => {
  try {
    return asString(value)
  } catch (error) {
    console.warn((error as Error).message)
    return ""
  }
}

/**
 * Tests if a file path ends with any of the provided extensions.
 *
 * @param path - Path to file.
 * @param extensions - File extensions to test.
 *
 * @public
 */
export const hasExtension = (path: string, extensions: string[]): boolean =>
  extensions.some((extension) => path.endsWith(extension))

/**
 * Parses JSON file with the string value reviver.
 *
 * @param content - String content read from file.
 *
 * @internal
 */
export const parseJson = <R extends AnyRecord>(content: string): R =>
  JSON.parse(content, reviver)

/**
 * Parses YAML file with the string value reviver.
 *
 * @param content - String content read from file.
 *
 * @internal
 */
export const parseYaml = <R extends AnyRecord>(content: string): R =>
  parse(content, reviver)
