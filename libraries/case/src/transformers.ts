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
  ParamCase,
  PascalCase,
  Prefix,
  SnakeCase
} from "./types"

/**
 * Convert string to `camelCase`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const camelCase = <V extends string>(value: V): CamelCase<V> =>
  _camelCase(value) as CamelCase<V>

/**
 * Convert string to `CONSTANT_CASE`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const constantCase = <V extends string>(value: V): ConstantCase<V> =>
  _constantCase(value) as ConstantCase<V>

/**
 * Convert string to `kebab-case`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const kebabCase = <V extends string>(value: V): KebabCase<V> =>
  _kebabCase(value) as KebabCase<V>

/**
 * Convert string to `PascalCase`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const pascalCase = <V extends string>(value: V): PascalCase<V> =>
  _pascalCase(value) as PascalCase<V>

/**
 * Convert string to `snake_case`.
 *
 * @param value - String value to convert.
 *
 * @public
 */
export const snakeCase = <V extends string>(value: V): SnakeCase<V> =>
  _snakeCase(value) as SnakeCase<V>

/**
 * Removes leading dashes from a string.
 *
 * @param value - String value to strip.
 *
 * @public
 */
export const removePrefix = (value: string): string =>
  value.replace(/^(-){1,2}/, "")

/**
 * Adds leading dash(es) to a string.
 *
 * @param value - String value to prefix.
 * @param prefix - Single or double dash to use as prefix.
 *
 * @public
 */
export const addPrefix = (value: string, prefix: Prefix): string =>
  prefix + removePrefix(value)

/**
 * Convert string to `--param-case`.
 *
 * @param value - String value to convert.
 * @param prefix - Single or double dash to use as prefix.
 *
 * @public
 */
export const paramCase = <
  V extends string,
  P extends Prefix = typeof DOUBLE_PREFIX
>(
  value: V,
  prefix: P = DOUBLE_PREFIX as P
): ParamCase<V, P> =>
  `${prefix}${kebabCase(removePrefix(value))}` as ParamCase<V, P>
