import { homedir } from "node:os"
import { resolve } from "node:path"
import { isNotNullish } from "@nodesuite/is"
import { pathExistsSync } from "fs-extra"
import type { AnyRecord } from "@nodesuite/is"

import { validExtensions } from "../types"
import { hasExtension } from "./serializaton"
import type { RawOptions } from "../types"

/**
 * Tests if existing raw options contain a path to file config.
 *
 * @remarks
 * Assumes that the path if provided is always set on the "config" property.
 *
 * @param options - Existing raw options.
 *
 * @internal
 */
const hasFilePath = <O extends RawOptions>(
  options: O
): options is O & { config: string } =>
  Object.keys(options).includes("config") &&
  isNotNullish((options as AnyRecord).config)

/**
 * Attempts to resolve a path to a valid options config file.
 *
 * @param stack - Existing raw options stack.
 *
 * @internal
 */
export const extractConfigPath = (stack: RawOptions[]): string | undefined => {
  for (const options of stack) {
    if (
      hasFilePath(options) &&
      hasExtension(options.config, [...validExtensions])
    ) {
      return options.config
    }
  }

  return undefined
}

/**
 * Searches all valid filesystem paths for any named config files.
 *
 * @remarks
 * Uses the app name as the stub for rc filename.
 * Should be called only once options from cli and env have been checked for a "config" options.
 *
 * @param appName - Name of application to use as rc filename.
 *
 * @internal
 */
export const searchFilePaths = async (appName: string): Promise<string[]> => {
  // Use app name to generate list of valid config file names.
  const fileNames: string[] = validExtensions.map(
    (extension) => `${appName}rc.${extension}`
  )

  // Define list of directory paths to search in.
  const searchPaths: string[] = ["./", homedir()]

  // Merge filenames and search paths to a single array.
  const paths: string[] = searchPaths.flatMap((searchPath) =>
    fileNames.map((fileName) => resolve(searchPath, fileName))
  )

  // Search all paths concurrently.
  const results: string[] = await Promise.all(
    paths.map(async (path) => (pathExistsSync(path) ? path : ""))
  )

  // Strip empty results.
  return results.filter((path) => isNotNullish(path))
}
