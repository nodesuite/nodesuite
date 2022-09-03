import { toCase } from "./transformer"
import {
  camelCase,
  constantCase,
  paramCase,
  pascalCase,
  snakeCase
} from "./transformers"
import type {
  CAMEL_CASE,
  Case,
  CONSTANT_CASE,
  PARAM_CASE,
  PASCAL_CASE,
  SNAKE_CASE,
  ToCase
} from "./types"

/**
 * Maps an array of values to a specific case.
 *
 * @param values - Array of strings to transform.
 * @param caseName - Case to transform to.
 *
 * @public
 */
export const mapToCase = <V extends string>(
  values: V[],
  caseName: Case
): ToCase<V, typeof caseName>[] =>
  values.map((value) => toCase(value, caseName))

/**
 * Maps an array of values to `camelCase`.
 *
 * @param values - Array of strings to transform.
 *
 * @public
 */
export const mapToCamelCase = <V extends string>(
  values: V[]
): ToCase<V, typeof CAMEL_CASE>[] => values.map((value) => camelCase(value))

/**
 * Maps an array of values to `CONSTANT_CASE`.
 *
 * @param values - Array of strings to transform.
 *
 * @public
 */
export const mapToConstantCase = <V extends string>(
  values: V[]
): ToCase<V, typeof CONSTANT_CASE>[] =>
  values.map((value) => constantCase(value))

/**
 * Maps an array of values to `--param-case`.
 *
 * @param values - Array of strings to transform.
 *
 * @public
 */
export const mapToParamCase = <V extends string>(
  values: V[]
): ToCase<V, typeof PARAM_CASE>[] => values.map((value) => paramCase(value))

/**
 * Maps an array of values to `PascalCase`.
 *
 * @param values - Array of strings to transform.
 *
 * @public
 */
export const mapToPascalCase = <V extends string>(
  values: V[]
): ToCase<V, typeof PASCAL_CASE>[] => values.map((value) => pascalCase(value))

/**
 * Maps an array of values to `snake_case`.
 *
 * @param values - Array of strings to transform.
 *
 * @public
 */
export const mapToSnakeCase = <V extends string>(
  values: V[]
): ToCase<V, typeof SNAKE_CASE>[] => values.map((value) => snakeCase(value))
