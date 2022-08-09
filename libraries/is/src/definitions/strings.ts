import { isOfType, STRING } from "../types"

/** String Types **/

export const isString = isOfType<string>(STRING)

export const isEmptyString = (value: unknown): value is "" =>
  isString(value) && value.length === 0

export const isWhitespace = (value: unknown): value is string =>
  isString(value) && !/\S/.test(value)

export const isEmptyStringOrWhitespace = (value: unknown): value is string =>
  isEmptyString(value) || isWhitespace(value)

export const isUrl = (value: unknown): value is string =>
  isString(value) && !!value.match(/^https?:\/\//)

export const isLowerCase = <T extends string = string>(value: T): boolean =>
  value === value.toLowerCase()

export const isUpperCase = <T extends string = string>(value: T): boolean =>
  value === value.toUpperCase()
