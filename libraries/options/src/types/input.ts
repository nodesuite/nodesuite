import { isFunction } from "@nodesuite/is"

import type { Options } from "./output"
import type { Serializable, Serialize } from "./serialization"

/**
 * Defines instructions on how to deserialize options.
 *
 * @public
 */
export interface Cast<T extends Serializable = Serializable> {
  // String representation of a native type.
  type: Serialize<T>
  // Optional default value.
  defaultValue?: T
  // If the property is optional or must be present.
  optional?: boolean
}

/**
 * Function interface for complex deserialization.
 *
 * @public
 */
export type Handler<T extends Serializable = Serializable> = (
  value: Serializable | undefined
) => T

/**
 * Union type for both Cast instructions and Handler functions.
 *
 * @public
 */
export type Parser<T extends Serializable = Serializable> = Cast<T> | Handler<T>

/**
 * Type guard for testing if a schema value is a Cast object.
 *
 * @param castOrHandler - Value from schema definition.
 *
 * @public
 */
export const isCast = <T extends Serializable = Serializable>(
  castOrHandler: Cast<T> | Handler<T>
): castOrHandler is Cast<T> => !isFunction(castOrHandler)

/**
 * Type guard for testing if a schema value is a Cast object.
 *
 * @param castOrHandler - Value from schema definition.
 *
 * @public
 */
export const isHandler = <T extends Serializable = Serializable>(
  castOrHandler: Cast<T> | Handler<T>
): castOrHandler is Handler<T> => isFunction(castOrHandler)

/**
 * Abstract schema interface.
 *
 * @public
 */
export type Schema = Record<PropertyKey, Cast | Handler>

/**
 * Allow inference of a Schema shape from a source object interface.
 *
 * @public
 */
export type InferSchema<O extends Options> = {
  [K in keyof O]: Parser<Exclude<O[K], undefined>>
}

/**
 * Export valid file extensions as constants.
 *
 * @public
 */
export const [JSON_EXT, YML_EXT, YAML_EXT] = [".json", ".yml", ".yaml"] as const

/**
 * Export array of valid file extensions.
 *
 * @public
 */
export const validExtensions = [JSON_EXT, YML_EXT, YAML_EXT] as const

/**
 * Union type of valid file extensions.
 *
 * @public
 */
export type ValidExtension = typeof validExtensions[number]
