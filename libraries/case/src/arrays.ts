import { toCase } from "./transformer"
import {
  camelCase,
  constantCase,
  paramCase,
  pascalCase,
  snakeCase
} from "./transformers"
import { DOUBLE_PREFIX } from "./types"
import type {
  CAMEL_CASE,
  Case,
  CONSTANT_CASE,
  PARAM_CASE,
  PASCAL_CASE,
  Prefix,
  SNAKE_CASE,
  ToCase
} from "./types"

export const mapToCase = <V extends string>(
  values: V[],
  caseName: Case
): ToCase<V, typeof caseName>[] =>
  values.map((value) => toCase(value, caseName))

export const mapToCamelCase = <V extends string>(
  values: V[]
): ToCase<V, typeof CAMEL_CASE>[] => values.map((value) => camelCase(value))

export const mapToConstantCase = <V extends string>(
  values: V[]
): ToCase<V, typeof CONSTANT_CASE>[] =>
  values.map((value) => constantCase(value))

export const mapToParamCase = <
  V extends string,
  P extends Prefix = typeof DOUBLE_PREFIX
>(
  values: V[],
  prefix: P = DOUBLE_PREFIX as P
): ToCase<V, typeof PARAM_CASE, P>[] =>
  values.map((value) => paramCase(value, prefix))

export const mapToPascalCase = <V extends string>(
  values: V[]
): ToCase<V, typeof PASCAL_CASE>[] => values.map((value) => pascalCase(value))

export const mapToSnakeCase = <V extends string>(
  values: V[]
): ToCase<V, typeof SNAKE_CASE>[] => values.map((value) => snakeCase(value))
