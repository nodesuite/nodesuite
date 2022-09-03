import { readFileSync } from "fs-extra"
import type { AnyRecord } from "@nodesuite/is"

import { FileReadError, InvalidFilePathError } from "./errors"
import { hasExtension, parseJson, parseYaml } from "./serializaton"
import type { ValidExtension } from "../types"

/**
 * Reads a file as text from the filesystem.
 *
 * @param filePath - Path to file.
 *
 * @internal
 */
const readFile = (filePath: string): string => {
  try {
    return readFileSync(filePath).toString("utf8")
  } catch (error) {
    throw new FileReadError(filePath, error as Error)
  }
}

/**
 * Reads a raw json file from the filesystem.
 *
 * @param filePath - Path to json file.
 * @param extensions - Optional json extension overrides.
 *
 * @internal
 */
const readRawJsonFile = <R extends AnyRecord>(
  filePath?: string,
  extensions: ValidExtension[] = [".json"]
): Partial<R> => {
  if (filePath && hasExtension(filePath, extensions)) {
    return parseJson(readFile(filePath))
  } else {
    throw new InvalidFilePathError(filePath, extensions)
  }
}

/**
 * Reads a raw yaml file from the filesystem.
 *
 * @param filePath - Path to yaml file.
 * @param extensions - Optional yaml extension overrides.
 *
 * @public
 */
export const readRawYamlFile = <R extends AnyRecord>(
  filePath?: string,
  extensions: ValidExtension[] = [".yml", ".yaml"]
): Partial<R> => {
  if (filePath && hasExtension(filePath, extensions)) {
    return parseYaml(readFile(filePath))
  } else {
    throw new InvalidFilePathError(filePath, extensions)
  }
}

/**
 * Reads and revives a raw config file of any valid format.
 *
 * @remarks
 * The file format will be inferred from the trailing file extension.
 * Valid formats are ".json", ".yaml", ".yml".
 * Files are revived with all values set to string type.
 *
 * @param filePath - Path to config file.
 *
 * @public
 */
export const readRawConfigFile = <R extends AnyRecord>(
  filePath?: string
): Partial<R> => {
  if (!filePath) {
    console.debug(`No config file filePath provided.`)
    return {}
  }

  if (hasExtension(filePath, [".json"])) {
    console.debug(`Reading JSON file from "${filePath}".`)
    return readRawJsonFile(filePath)
  }

  if (hasExtension(filePath, [".yml", ".yaml"])) {
    console.debug(`Reading YAML file from "${filePath}".`)
    return readRawYamlFile(filePath)
  }

  console.debug(`File path "${filePath}" did not match any valid patterns.`)
  return {}
}
