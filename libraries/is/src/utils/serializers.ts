import { isArray, isFalsy, isObject, isTruthy } from "../definitions"

/**
 * Converts an unknown value to its string format.
 *
 * @internal
 */
export const _toString = (value: unknown): string =>
  Object.prototype.toString.call(value)

/**
 * Attempts to cast an unknown value as a boolean value.
 *
 * @remarks
 * - Numbers are returned as is.
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
 * Union type for binary values.
 *
 * @public
 */
export type Binary = 0 | 1

/**
 * Attempts to cast an unknown value as a binary value (0 or 1).
 *
 * @remarks
 * - Numbers are returned as is.
 *
 * @public
 */
export const asBinary = (
  value: unknown,
  defaultValue: Binary | undefined = undefined
): Binary | typeof defaultValue => {
  // Pass through serializable values.
  switch (typeof value) {
    case "number":
    case "string":
    case "boolean":
      return isTruthy(value) ? 1 : isFalsy(value) ? 0 : undefined
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
export const asString = (value: unknown, defaultValue?: string): string => {
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
      return defaultValue ?? ""
  }

  // Flatten arrays using the global array separator.
  if (isArray(value)) {
    return value.map((v) => asString(v, undefined)).join(",")
  }

  // Attempt to convert complex objects or functions.
  return _toString(value)
}

/**
 * Parses a possible json string and tests if array before returning.
 *
 * @param value - Possible json string.
 *
 * @internal
 */
const parseJsonArray = <T extends Serializable>(
  value: string
): T[] | undefined => {
  try {
    const content: unknown = JSON.parse(value)
    if (isArray<T>(content)) {
      return content
    }
  } catch (_) {
    // Ignore errors from JSON.parse().
  }

  return undefined
}

/**
 * Attempts to return an unknown value as a string array.
 *
 * @remarks
 *
 * @param value - Any value to deserialize as a string array.
 * @param defaultValue - Fallback value if value is undefined.
 */
export const asStringArray = (
  value: unknown,
  defaultValue?: string[]
): string[] | undefined => {
  // Pass through serializable values.
  switch (typeof value) {
    case "string":
      // Attempt to parse string as json and test if string array.
      const json: string[] | undefined = parseJsonArray<string>(value)
      if (json) {
        return json
      }

      // Attempt to split comma separated string.
      if (value.includes(",")) {
        return value.split(",")
      }

      // If no matches, return default value.
      return defaultValue
    case "object":
      return isArray<string>(value) ? value : defaultValue
    case "number":
    case "boolean":
    case "symbol":
    case "bigint":
    case "undefined":
    default:
      return defaultValue
  }
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

/**
 * Attempts to return an unknown value as object.
 *
 * @public
 */
export const asObject = (value: unknown, defaultValue?: object | undefined) => {
  // Pass through serializable values.
  switch (typeof value) {
    case "object":
      return isObject(value) ? value : defaultValue
    case "string":
      return JSON.parse(value)
    case "number":
    case "boolean":
    case "symbol":
    case "bigint":
    case "undefined":
      return defaultValue
  }
}
