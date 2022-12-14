import { isOfType, STRING } from "../types"

/** String Types **/

export const isString = isOfType<string>(STRING)

export const isEmptyString = (value: unknown): value is "" =>
  isString(value) && value.length === 0

export const isWhitespace = (value: unknown): value is string =>
  isString(value) && !/\S/.test(value)

export const isEmptyStringOrWhitespace = (value: unknown): value is string =>
  isEmptyString(value) || isWhitespace(value)

export const isUrl = (value: unknown): value is string => {
  try {
    if (isString(value)) {
      return !!new URL(value)
    }
  } catch (error) {
    // Ignore errors.
  }
  return false
}

/**
 * Note: Loose match, does not attempt complex validation.
 *
 * @param value - Any string value to test.
 *
 * @public
 */
export const isEmail = (value: unknown): value is string =>
  isString(value) && !!value.match(/^\S+@\S+.\S{1,50}/i)

export const isLowerCase = <T extends string = string>(value: T): boolean =>
  value === value.toLowerCase()

export const isUpperCase = <T extends string = string>(value: T): boolean =>
  value === value.toUpperCase()

export const isLocale = (value: unknown): boolean =>
  isString(value) &&
  !!(
    ["en_US_POSIX", "ca_ES_VALENCIA"].includes(value) ||
    value.match(
      /^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|\d{3}))?([_-]([A-Za-z]{2}|\d{3}))?$/
    )
  )

/**
 *
 * @see https://github.com/validatorjs/validator.js/blob/master/src/lib/isMD5.js
 */
export const isMD5 = (value: unknown): boolean =>
  isString(value) && !!value.match(/^[a-f0-9]{32}$/)

/**
 *
 * @see https://github.com/validatorjs/validator.js/blob/master/src/lib/isSlug.js
 */
export const isSlug = (value: unknown): boolean =>
  isString(value) &&
  !!value.match(/^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\]\S*[^-_\s]$/)

/**
 * @see https://github.com/validatorjs/validator.js/blob/master/src/lib/isSemVer.js
 */
export const isSemVer = (value: unknown): boolean =>
  isString(value) &&
  !![
    /^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)/i,
    /-((?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*))*)/i,
    /(?:\\+([0-9a-z-]+(?:\\.[0-9a-z-]+)*))?$/i
  ].find((pattern) => value.match(pattern))

/**
 * @see https://github.com/validatorjs/validator.js/blob/master/src/lib/isUUID.js
 */
export const isUUID4 = (value: unknown): boolean =>
  isString(value) &&
  !!value.match(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  )
