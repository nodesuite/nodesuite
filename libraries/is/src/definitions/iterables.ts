import { isObjectOfType, MAP, SET, WEAK_MAP, WEAK_SET } from "../types"
import { isFunction } from "./common"

/** Iterable Types **/

export const isArray = <T = unknown>(
  value: unknown,
  assertion?: (value: T) => value is T
): value is T[] => {
  if (!Array.isArray(value)) {
    return false
  }

  if (!isFunction(assertion)) {
    return true
  }

  return value.every(assertion)
}

export const isIterable = <T = unknown>(value: unknown): value is Iterable<T> =>
  isFunction((value as Iterable<T>)?.[Symbol.iterator])

export const isMap = <Key = unknown, Value = unknown>(
  value: unknown
): value is Map<Key, Value> => isObjectOfType<Map<Key, Value>>(MAP)(value)

export const isSet = <T = unknown>(value: unknown): value is Set<T> =>
  isObjectOfType<Set<T>>(SET)(value)

export const isWeakMap = <Key extends object = object, Value = unknown>(
  value: unknown
): value is WeakMap<Key, Value> =>
  isObjectOfType<WeakMap<Key, Value>>(WEAK_MAP)(value)

export const isWeakSet = (value: unknown): value is WeakSet<object> =>
  isObjectOfType<WeakSet<object>>(WEAK_SET)(value)

export const isEmptySet = (value: unknown): value is Set<never> =>
  isSet(value) && value.size === 0

export const isNonEmptySet = <T = unknown>(value: unknown): value is Set<T> =>
  isSet(value) && value.size > 0

export const isEmptyMap = (value: unknown): value is Map<never, never> =>
  isMap(value) && value.size === 0

export const isNonEmptyMap = <Key = unknown, Value = unknown>(
  value: unknown
): value is Map<Key, Value> => isMap(value) && value.size > 0
