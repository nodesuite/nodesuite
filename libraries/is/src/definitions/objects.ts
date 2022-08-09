import { isFunction } from "./common"
import { isMap, isSet } from "./iterables"
import { isNull, isUndefined } from "./nulls"

const { toString } = Object.prototype

/** Object Types **/

export const isObject = (value: unknown): value is object =>
  !isNull(value) && (typeof value === "object" || isFunction(value))

export const isPlainObject = <Value = unknown>(
  value: unknown
): value is Record<PropertyKey, Value> => {
  // From: https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
  if (toString.call(value) !== "[object Object]") {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === null || prototype === Object.getPrototypeOf({})
}

export const isEmptyObject = <Key extends keyof any = string>(
  value: unknown
): value is Record<Key, never> =>
  isObject(value) &&
  !isMap(value) &&
  !isSet(value) &&
  Object.keys(value).length === 0

// - https://github.com/Microsoft/TypeScript/pull/29317
export const isNonEmptyObject = <
  Key extends keyof any = string,
  Value = unknown
>(
  value: unknown
): value is Record<Key, Value> =>
  isObject(value) &&
  !isMap(value) &&
  !isSet(value) &&
  Object.keys(value).length > 0

/**
 * Verifies a value is a key of a reference object.
 */
export const isKeyOf = <O extends object>(
  value: O,
  key: keyof any
): key is keyof O => key in value

/**
 * Verifies if a value is a keyed value of a reference object.
 */
export const isValueOf = <O>(obj: O, value: unknown): value is O[keyof O] =>
  Object.values(obj).includes(value)

type CommonKeys<O extends object, P extends Partial<O>> = Extract<
  keyof O,
  keyof P
>

/**
 * Matches a source object against a partial version of itself.
 *
 * If all non-nullable values match, the function returns true.
 * Importantly, `undefined` values in the partial object are ignored.
 *
 * @param original - Complete source object to inspect.
 * @param partial - Partial version of source to match.
 *
 * @public
 */
export const isMatch = <
  O extends object,
  P extends Partial<O>,
  K extends CommonKeys<O, P> = CommonKeys<O, P>
>(
  original: O,
  partial: P
): boolean =>
  Object.entries(partial).every(([key, value]) =>
    !isUndefined(value) ? original[key as K] === value : true
  )
