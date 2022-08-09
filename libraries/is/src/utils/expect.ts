import { isError, isNotNullish } from "../definitions"
import { NonNullableError } from "../errors"

/**
 * Throws if a provided value is nullish.
 *
 * @param value - Value to inspect.
 * @param error - Error to throw if value is nullish.
 *
 * @public
 */
export const expect = <T>(
  value: T | undefined | null,
  error: string | Error = "Failed to locate required value."
): NonNullable<T> => {
  if (isNotNullish(value)) {
    return value
  } else if (isError(error)) {
    throw error
  } else {
    throw new NonNullableError(error)
  }
}
