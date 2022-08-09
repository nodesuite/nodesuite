import { isKeyOf, isNotNullish } from "../definitions"

/**
 * Matches a source object against a partial version of itself.
 *
 * If all non-nullable values match, the function returns true.
 * Importantly, undefined values in the partial search object are ignored.
 *
 * @param source - Complete source object to inspect.
 * @param search - Partial version of source to match.
 *
 * @public
 */
export const match = <Source extends object, Query extends Partial<Source>>(
  source: Source,
  search: Query
): boolean =>
  Object.entries(search).every(([key, value]) =>
    isNotNullish(value) && isKeyOf(source, key) ? source[key] === value : true
  )
