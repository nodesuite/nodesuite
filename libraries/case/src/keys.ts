import {
  camelCase,
  constantCase,
  paramCase,
  pascalCase,
  removePrefix,
  snakeCase
} from "./transformers"
import { DOUBLE_PREFIX } from "./types"
import type {
  CamelCaseKeys,
  ConstantCaseKeys,
  Input,
  KebabCaseKeys,
  ParamCaseKeys,
  PascalCaseKeys,
  Prefix,
  SnakeCaseKeys
} from "./types"

/**
 * Converts all top level keys of an object to `camelCase`.
 *
 * @param input - Object containing keys to convert to `camelCase`.
 */
export const camelCaseKeys = <T extends Record<string, any>>(
  input: T
): CamelCaseKeys<T> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [camelCase(key), value])
  ) as CamelCaseKeys<T>

/**
 * Converts all top level keys of an object to `camelCase`.
 *
 * @param input - Object containing keys to convert to `camelCase`.
 */
export const constantCaseKeys = <T extends Record<string, any>>(
  input: T
): ConstantCaseKeys<T> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [constantCase(key), value])
  ) as ConstantCaseKeys<T>

/**
 * Converts all top level keys of an object to `--param-case`.
 *
 */
export const paramCaseKeys = <
  T extends Input,
  P extends Prefix = typeof DOUBLE_PREFIX
>(
  input: T,
  prefix: P = DOUBLE_PREFIX as P
): ParamCaseKeys<T, P> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [paramCase(key, prefix), value])
  ) as ParamCaseKeys<T, P>

/**
 * Removes `--param-case` dash prefix from keys.
 *
 */
export const stripParamCaseKeys = <T extends Input>(
  input: KebabCaseKeys<T>
): T =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [removePrefix(key), value])
  ) as T

/**
 * Converts all top level keys of an object to `PascalCase`.
 *
 * @param input - Object containing keys to convert to `PascalCase`.
 */
export const pascalCaseKeys = <T extends Input>(input: T): PascalCaseKeys<T> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [pascalCase(key), value])
  ) as PascalCaseKeys<T>

/**
 * Converts all top level keys of an object to `kebab-case`.
 *
 * @param input - Object containing keys to convert to `kebab-case`.
 */
export const kebabCaseKeys = <T extends Input>(input: T): KebabCaseKeys<T> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [pascalCase(key), value])
  ) as KebabCaseKeys<T>

/**
 * Converts all top level keys of an object to `snake_case`.
 *
 * @param input - Object containing keys to convert to `snake_case`.
 */
export const snakeCaseKeys = <T extends Input>(input: T): SnakeCaseKeys<T> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [snakeCase(key), value])
  ) as SnakeCaseKeys<T>
