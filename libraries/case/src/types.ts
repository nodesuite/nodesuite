import type {
  CamelCase as _CamelCase,
  KebabCase as _KebabCase,
  PascalCase as _PascalCase,
  ScreamingSnakeCase as _ConstantCase,
  SnakeCase as _SnakeCase
} from "type-fest"

/**
 * Define the default prefix values for `--param-case`.
 *
 * @public
 */
export const [SINGLE_PREFIX, DOUBLE_PREFIX] = ["-", "--"] as const
export const prefixes = [SINGLE_PREFIX, DOUBLE_PREFIX] as const
export type Prefix = typeof prefixes[number]

/**
 * Utility type to remove a known prefix if present.
 */
export type StripPrefix<T extends string> = T extends `--${infer R}` ? R : T

/**
 * Normalizes previous value before recasting.
 *
 * @remarks
 * This fixes a bug where `CONSTANT_CASE` values were incorrectly cast as `c-o-n-s-t-a-n-t-c-a-s-e`.
 * Additionally strips leading prefix from `--param-case` values to avoid recursive duplication.
 *
 * @internal
 */
export type Normalize<T extends string> = StripPrefix<
  Uppercase<T> extends T ? Lowercase<T> : T
>

/**
 * Convert a string value to `camelCase`.
 *
 * @public
 */
export type CamelCase<T extends string> = _CamelCase<Normalize<T>>

/**
 * Convert a string value to `kebab-case`.
 *
 * @public
 */
export type KebabCase<T extends string> = _KebabCase<Normalize<T>>

/**
 * Convert a string value to `PascalCase`.
 *
 * @public
 */
export type PascalCase<T extends string> = _PascalCase<Normalize<T>>

/**
 * Convert a string value to `CONSTANT_CASE`.
 *
 * @public
 */
export type ConstantCase<T extends string> = _ConstantCase<Normalize<T>>

/**
 * Convert a string value to `snake_case`.
 *
 * @public
 */
export type SnakeCase<T extends string> = _SnakeCase<Normalize<T>>

/**
 * Convert a string value to `--param-case`.
 *
 * @remarks
 * Existing prefixes are stripped to avoid duplication.
 *
 * @public
 */
export type ParamCase<T extends string> = `--${KebabCase<Normalize<T>>}`

/**
 * Provide all valid case names as constants.
 *
 * @public
 */
export const [
  CAMEL_CASE,
  CONSTANT_CASE,
  KEBAB_CASE,
  PARAM_CASE,
  PASCAL_CASE,
  SNAKE_CASE
] = ["camel", "constant", "kebab", "param", "pascal", "snake"] as const

/**
 * Provide all valid case names in array.
 *
 * @public
 */
export const caseFormats = [
  CAMEL_CASE,
  CONSTANT_CASE,
  KEBAB_CASE,
  PARAM_CASE,
  PASCAL_CASE,
  SNAKE_CASE
] as const

/**
 * Utility type for extracting string keys from generic object keys.
 *
 * @internal
 */
type KeyOf<T extends object> = Extract<keyof T, string>

/**
 * Union type of all value case names.
 *
 * @public
 */
export type Case = typeof caseFormats[number]

/**
 * Expected shape of any objects.
 *
 * @public
 */
export type Input = Record<string, any>

/**
 * Mapping of transformer utility types.
 *
 * @internal
 */
export interface Transformers<V extends string = string> {
  [CAMEL_CASE]: CamelCase<V>
  [CONSTANT_CASE]: ConstantCase<V>
  [KEBAB_CASE]: KebabCase<V>
  [PARAM_CASE]: ParamCase<V>
  [PASCAL_CASE]: PascalCase<V>
  [SNAKE_CASE]: SnakeCase<V>
}

/**
 * Type utility to transform a string type's case.
 *
 * @public
 */
export type ToCase<V extends string, C extends Case> = Transformers<V>[C]

/**
 * Shape of an abstract case transformation function.
 *
 * @internal
 */
export type CaseFunction<C extends Case> = <V extends string>(
  value: V
) => ToCase<V, C>

/**
 * Mapping of transformer function types.
 *
 * @internal
 */
export interface TransformerFunctions {
  [CAMEL_CASE]: CaseFunction<typeof CAMEL_CASE>
  [CONSTANT_CASE]: CaseFunction<typeof CONSTANT_CASE>
  [KEBAB_CASE]: CaseFunction<typeof KEBAB_CASE>
  [PARAM_CASE]: CaseFunction<typeof PARAM_CASE>
  [PASCAL_CASE]: CaseFunction<typeof PASCAL_CASE>
  [SNAKE_CASE]: CaseFunction<typeof SNAKE_CASE>
}

/**
 * Ensures string keys.
 *
 * @public
 */
export type StringKeys<O extends Input> = {
  [K in keyof O]: O[K]
}

/**
 * Converts an array of strings to a new case.
 *
 * @public
 */
export type ArrayToCase<V extends string, C extends Case> = ToCase<V, C>[]

/**
 * Setup optional keys check.
 *
 * @internal
 */
type Undefined<T extends Input> = {
  [K in keyof T]: K extends undefined ? T[K] : never
}

/**
 * Filter flags base on condition.
 *
 * @internal
 */
type FilterFlags<Base extends Input, Condition> = {
  [K in keyof Base]: Base[K] extends Condition ? K : never
}

/**
 * Filter names based on condition.
 *
 * @internal
 */
type AllowedNames<Base extends Input, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base]

/**
 * Filters a type.
 *
 * @internal
 */
type SubType<Base extends Input, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>

/**
 * Extract list of optional keys.
 *
 * @internal
 */
type OptionalKeys<T extends Input> = Exclude<
  keyof T,
  NonNullable<keyof SubType<Undefined<T>, never>>
>

/**
 * Convert only all provided keys as required.
 *
 * @internal
 */
type ConvertKeys<T extends Input, C extends Case> = {
  [K in KeyOf<T> as ToCase<K, C>]: T[K]
}

/**
 * Convert only optional keys.
 *
 * @internal
 */
type ConvertOptional<T extends Input, C extends Case> = Partial<
  ConvertKeys<Pick<T, OptionalKeys<T>>, C>
>

/**
 * Convert only non-optional keys.
 *
 * @internal
 */
type ConvertRequired<T extends Input, C extends Case> = ConvertKeys<
  Omit<T, OptionalKeys<T>>,
  C
>

/**
 * Preserve optional properties during conversion.
 *
 * @internal
 */
type KeysToCase<T extends Input, C extends Case> = ConvertRequired<T, C> &
  ConvertOptional<T, C>

/**
 * Converts an objects keys to `camelCase`.
 *
 * @public
 */
export type CamelCaseKeys<T extends Input> = KeysToCase<T, "camel">

/**
 * Converts an objects keys to `CONSTANT_CASE`.
 *
 * @public
 */
export type ConstantCaseKeys<T extends Input> = KeysToCase<T, "constant">

/**
 * Converts an objects keys to `kebab-case`.
 *
 * @public
 */
export type KebabCaseKeys<T extends Input> = KeysToCase<T, "kebab">

/**
 * Converts an objects keys to `snake_case`.
 *
 * @public
 */
export type SnakeCaseKeys<T extends Input> = KeysToCase<T, "snake">

/**
 * Converts an objects keys to `PascalCase`.
 *
 * @public
 */
export type PascalCaseKeys<T extends Input> = KeysToCase<T, "pascal">

/**
 * Converts an objects keys to `--param-case`.
 *
 * @public
 */
export type ParamCaseKeys<T extends Input> = {
  [K in KeyOf<T> as ParamCase<K>]: T[K]
}

/**
 * Union of all possible key transformations.
 *
 * @remarks
 * Using this union type is expensive, so use only when absolutely necessary.
 *
 * @public
 */
export type AnyCaseKeys<O extends Input> =
  | StringKeys<O>
  | CamelCaseKeys<O>
  | ConstantCaseKeys<O>
  | KebabCaseKeys<O>
  | SnakeCaseKeys<O>
  | PascalCaseKeys<O>
