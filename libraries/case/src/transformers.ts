import {
  camelCase as _camelCase,
  constantCase as _constantCase,
  paramCase as _kebabCase,
  pascalCase as _pascalCase,
  snakeCase as _snakeCase
} from "change-case"

import { DOUBLE_PREFIX } from "./types"
import type {
  CamelCase,
  ConstantCase,
  KebabCase,
  Normalize,
  ParamCase,
  PascalCase,
  SnakeCase,
  StripPrefix
} from "./types"

/**
 * Removes leading dashes from a string.
 *
 * @param value - String value to strip.
 *
 * @public
 */
export const stripPrefix = <V extends string>(value: V): StripPrefix<V> =>
  value.replace(/^--/, "") as StripPrefix<V>

/**
 * Normalizes value prior to recasting.
 *
 * @param original - String value to normalize.
 *
 * @public
 */
export const normalize = <V extends string>(original: V): Normalize<V> => {
  let value: string = stripPrefix(original)
  if (value === value.toUpperCase()) {
    value = value.toLowerCase()
  }
  return `${value}` as Normalize<V>
}

/**
 * Convert string to `camelCase`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const camelCase = <V extends string>(value: V): CamelCase<V> =>
  _camelCase(normalize(value)) as CamelCase<V>

/**
 * Convert string to `CONSTANT_CASE`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const constantCase = <V extends string>(value: V): ConstantCase<V> =>
  _constantCase(normalize(value)) as ConstantCase<V>

/**
 * Convert string to `kebab-case`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const kebabCase = <V extends string>(value: V): KebabCase<V> =>
  _kebabCase(normalize(value)) as KebabCase<V>

/**
 * Convert string to `PascalCase`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const pascalCase = <V extends string>(value: V): PascalCase<V> =>
  _pascalCase(normalize(value)) as PascalCase<V>

/**
 * Convert string to `snake_case`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const snakeCase = <V extends string>(value: V): SnakeCase<V> =>
  _snakeCase(normalize(value)) as SnakeCase<V>

/**
 * Type guard to test if a value is already cast as param case.
 *
 * @param value- String value to test.
 *
 * @public
 */
export const isParamCase = (value: string): value is ParamCase<typeof value> =>
  !!value && value.startsWith(DOUBLE_PREFIX) && value.toLowerCase() === value

/**
 * Convert string to `--param-case`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const paramCase = <V extends string>(value: V): ParamCase<V> =>
  `${DOUBLE_PREFIX}${kebabCase(normalize(value))}`
