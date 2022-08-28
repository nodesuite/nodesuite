import { isObject, isUndefined } from "@nodesuite/is"
import type { AnyRecord, KeyOf } from "@nodesuite/is"

import { UnfilterableValueError } from "./errors"
import type { FilteredObject } from "../types"

/**
 * Extracts string keys from a source object.
 *
 * @param source - Source object to extract typed keys from.
 *
 * @public
 */
export const extractKeys = <O extends object>(source: O): KeyOf<O>[] =>
  Object.keys(source) as KeyOf<O>[]

/**
 * Strips non-matching keys from an object.
 *
 * @param source - Original object to process.
 * @param keys - Keys to preserve.
 * @param stripEmpty - If undefined or nullish values should be additionally stripped.
 *
 * @public
 */
export const filter = <
  K extends string,
  O extends AnyRecord,
  S extends boolean
>(
  source: O,
  keys: K[],
  stripEmpty: boolean = true
): FilteredObject<K, O, S> => {
  if (!isObject(source)) {
    throw new UnfilterableValueError(source)
  }
  return Object.fromEntries(
    Object.entries(source)
      .filter(([key]) => keys.includes(key as K))
      .filter(([, value]) => (stripEmpty ? !isUndefined(value) : true))
  ) as FilteredObject<K, O, S>
}
