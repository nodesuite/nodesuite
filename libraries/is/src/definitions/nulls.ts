import { isOfType, UNDEFINED } from "../types"
import type { Nullish } from "../types";

/** Empty Types **/

export const isNull = (value: unknown): value is null => value === null

export const isUndefined = isOfType<undefined>(UNDEFINED)

export const isNan = (value: unknown) => Number.isNaN(value as number)

export const isNullish = (value: unknown): value is Nullish =>
  isNull(value) || isUndefined(value)

export const isNotNullish = <T>(value: T | Nullish): value is NonNullable<T> =>
  !isNullish(value)
