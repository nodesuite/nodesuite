import {
  asBoolean,
  asNumber,
  asObject,
  asString,
  asStringArray,
  isNotNullish,
  isUndefined
} from "@nodesuite/is"

import { DeserializationError, MissingRequiredValueError } from "../support"
import { isHandler } from "../types"
import type { Cast, Handler, Serializable } from "../types"

/**
 * Parses a value according to its correlated `Cast` or `Handler` from schema.
 *
 * @param key - Name of key for logging.
 * @param value - Value to parse. Should be typically string or undefined.
 * @param cast - Cast definition or Handler logic.
 *
 * @internal
 */
export const parse = <T extends Serializable, C extends Cast<T> | Handler<T>>(
  key: PropertyKey,
  value: Serializable | undefined,
  cast: C
): T | undefined => {
  // Handle via handler function if provided.
  if (isHandler<T>(cast)) {
    console.debug(`Using function handler for ${key.toString()}.`)
    return cast(value)
  }

  // Handle undefined values according to schema.
  if (isUndefined(value)) {
    if (cast.optional) {
      // If undefined but optional, allow it through.
      console.debug(
        `Optional value ${key.toString()} was undefined, using default value "${
          cast.defaultValue
        }".`
      )
      return cast.defaultValue ?? undefined
    } else if (isNotNullish(cast.defaultValue)) {
      // If undefined and required, only allow if default value is provided.
      console.debug(
        `Required value ${key.toString()} was undefined, using default value "${
          cast.defaultValue
        }".`
      )
      return cast.defaultValue
    } else {
      // If undefined and required with no default value, throw an error.
      throw new MissingRequiredValueError()
    }
  }

  // Handle using regular cast parser.
  switch (cast.type) {
    case "string":
      return asString(value) as T
    case "number":
      return asNumber(value) as T
    case "boolean":
      return asBoolean(value) as T
    case "array":
      return asStringArray(value) as T
    case "object":
      return asObject(value) as T
    default:
      throw new DeserializationError()
  }
}