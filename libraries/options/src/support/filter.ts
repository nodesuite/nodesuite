import { isObject, isUndefined } from "@nodesuite/is"

import { InvalidObjectError } from "./errors"
import type { FilteredObject } from "../types"

/**
 * Strips non-matching keys from an object.
 *
 * @param source - Original object to process.
 * @param keys - Keys to preserve.
 *
 * @public
 */
export const filter = <O extends object, K extends keyof O>(
  source: O,
  keys: K[]
): FilteredObject<O, K> => {
  if (!isObject(source)) {
    throw new InvalidObjectError(source)
  }
  return Object.fromEntries(
    Object.entries(source)
      .filter(([key]) => keys.includes(key as K))
      .filter(([, value]) => !isUndefined(value))
  ) as FilteredObject<O, K>
}
