import type { Falsy } from "../types"

/** Boolean Types **/

export const isBoolean = (value: unknown): value is boolean =>
  value === true || value === false

export const isTruthy = <T>(value: T | Falsy): value is T => Boolean(value)

export const isFalsy = <T>(value: T | Falsy): value is Falsy => !value
