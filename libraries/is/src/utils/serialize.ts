/**
 * Converts an unknown value to its string format.
 *
 * @internal
 */
const toString = (value: unknown): string =>
  Object.prototype.toString.call(value)

/**
 * Serializes an unknown value to string.
 *
 * @param value - Any value to serialize.
 *
 * @public
 */
export const serialize = (value: unknown): string => {
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return `${value}`
    case "bigint":
    case "symbol":
      return value.toString()
  }

  return toString(value ?? "")
}
