import {
  camelCase,
  constantCase,
  kebabCase,
  paramCase,
  pascalCase,
  snakeCase
} from "./transformers"
import {
  CAMEL_CASE,
  CONSTANT_CASE,
  KEBAB_CASE,
  PARAM_CASE,
  PASCAL_CASE,
  SNAKE_CASE
} from "./types"
import type { Case, ToCase, TransformerFunctions } from "./types"

/**
 * Provide transformer functions as a lookup map.
 *
 * @public
 */
export const transformers: TransformerFunctions = {
  [CAMEL_CASE]: camelCase,
  [CONSTANT_CASE]: constantCase,
  [KEBAB_CASE]: kebabCase,
  [PARAM_CASE]: paramCase,
  [PASCAL_CASE]: pascalCase,
  [SNAKE_CASE]: snakeCase
}

/**
 * Provide universal case transformer function.
 *
 * @remarks
 * If a single dash prefix is required when using `--param-case`, the
 *  `paramCase()` function should be called directly.
 *
 * @param value - String value to transform.
 * @param caseName - Typed case id to transform to.
 *
 * @public
 */
export const toCase = <V extends string>(
  value: V,
  caseName: Case
): ToCase<V, typeof caseName> => transformers[caseName](value)
