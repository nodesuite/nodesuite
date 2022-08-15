import { isArray, isFalsy, isTruthy } from "../definitions"

/**
 * Converts an unknown value to its string format.
 *
 * @internal
 */
export const _toString = (value: unknown): string =>
  Object.prototype.toString.call(value)

/**
 * Attempts to cast an unknown value as a number.
 *
 * @remarks
 * - Numbers are returned as is.
 * - Strings and Bigint values are parsed through `parseInt`.
 * - Booleans will check for truthy or falsy-ness and return `1` or `0`, else `undefined`.
 * - All other values will return the `defaultValue` provided or `undefined`.
 *
 * @public
 */
export const asBoolean = (
  value: unknown,
  defaultValue: boolean | undefined = undefined
): boolean | typeof defaultValue => {
  // Pass through serializable values.
  switch (typeof value) {
    case "number":
    case "string":
    case "boolean":
      return isTruthy(value) ? true : isFalsy(value) ? false : undefined
    case "undefined":
    default:
      return defaultValue
  }
}

/**
 * Attempts to cast an unknown value as a number.
 *
 * @remarks
 * - Numbers are returned as is.
 * - Strings and Bigint values are parsed through `parseInt`.
 * - Booleans will check for truthy or falsy-ness and return `1` or `0`, else `undefined`.
 * - All other values will return the `defaultValue` provided or `undefined`.
 *
 * @public
 */
export const asNumber = (
  value: unknown,
  defaultValue: number | undefined = undefined
): number | typeof defaultValue => {
  // Pass through serializable values.
  switch (typeof value) {
    case "number":
      return value
    case "bigint":
      return parseInt(value.toString())
    case "string":
      return parseInt(`${value}`)
    case "boolean":
      return isTruthy(value) ? 1 : isFalsy(value) ? 0 : undefined
    case "undefined":
    default:
      return defaultValue
  }
}

/**
 * List of serializable types.
 *
 * @public
 */
export type Serializable =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | object
  | Serializable[]

/**
 * Attempts to return an unknown value as a string.
 *
 * @remarks
 * - Strings will be returned directly.
 * - Numbers, booleans, etc. will have their `toString()` method called.
 * - Functions and objects will be stringified if possible.
 *
 * @public
 */
export const asString = (
  value: unknown,
  defaultValue?: string
): undefined extends typeof value ? typeof defaultValue : string => {
  // Pass through serializable values.
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return `${value}`
    case "symbol":
    case "bigint":
      return value.toString()
    case "undefined":
      return defaultValue
  }

  // Flatten arrays using the global array separator.
  if (isArray(value)) {
    return value.map((v) => asString(v)).join(" ")
  }

  // Attempt to convert complex objects or functions.
  return _toString(value)
}

/**
 * Serializes an unknown value to string.
 *
 * @remarks
 * Alias for `asString()`.
 *
 * @param value - Any value to serialize.
 *
 * @public
 */
export const serialize = asString

/**
 * Converts an object to a prettified json string.
 *
 * @public
 */
export const stringify = (obj: object): string =>
  JSON.stringify(obj, undefined, 2)
