import { BIGINT, isOfType, NUMBER } from "../types"
import { isNan } from "./nulls"
import { isEmptyStringOrWhitespace, isString } from "./strings"

/** Numeric Types **/

export const isNumber = (value: unknown): value is number =>
  isOfType<number>(NUMBER) && !isNan(value)

export const isBigint = isOfType<bigint>(BIGINT)

export const isInteger = (value: unknown): value is number =>
  Number.isInteger(value as number)

export const isSafeInteger = (value: unknown): value is number =>
  Number.isSafeInteger(value as number)

export const isNumericString = (value: unknown): value is string =>
  isString(value) &&
  !isEmptyStringOrWhitespace(value) &&
  !Number.isNaN(Number(value))
