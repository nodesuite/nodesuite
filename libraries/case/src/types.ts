import type {
  CamelCase,
  KebabCase,
  PascalCase,
  ScreamingSnakeCase as ConstantCase,
  SnakeCase
} from "type-fest"

export type { CamelCase, ConstantCase, KebabCase, PascalCase, SnakeCase }

export const [SINGLE_PREFIX, DOUBLE_PREFIX] = ["-", "--"] as const
export const prefixes = [SINGLE_PREFIX, DOUBLE_PREFIX] as const
export type Prefix = typeof prefixes[number]

export type ParamCase<
  V extends string,
  P extends Prefix
> = `${P}${KebabCase<V>}`

export const [
  CAMEL_CASE,
  CONSTANT_CASE,
  KEBAB_CASE,
  PARAM_CASE,
  PASCAL_CASE,
  SNAKE_CASE
] = ["camel", "constant", "kebab", "param", "pascal", "snake"] as const

export const caseFormats = [
  CAMEL_CASE,
  CONSTANT_CASE,
  KEBAB_CASE,
  PARAM_CASE,
  PASCAL_CASE,
  SNAKE_CASE
] as const

export type KeyOf<T extends object> = Extract<keyof T, string>

export type Case = typeof caseFormats[number]

export type Input = Record<string, any>

export interface Transformers<
  V extends string = string,
  P extends Prefix = Prefix
> {
  [CAMEL_CASE]: CamelCase<V>
  [CONSTANT_CASE]: ConstantCase<V>
  [KEBAB_CASE]: KebabCase<V>
  [PARAM_CASE]: ParamCase<V, P>
  [PASCAL_CASE]: PascalCase<V>
  [SNAKE_CASE]: SnakeCase<V>
}

export type ToCase<
  V extends string,
  C extends Case,
  P extends Prefix = Prefix
> = Transformers<V, P>[C]

export type CaseFunction<C extends Case> = <
  V extends string,
  P extends Prefix = Prefix
>(
  value: V,
  prefix?: P
) => ToCase<V, C, P>

export interface TransformerFunctions {
  [CAMEL_CASE]: CaseFunction<typeof CAMEL_CASE>
  [CONSTANT_CASE]: CaseFunction<typeof CONSTANT_CASE>
  [KEBAB_CASE]: CaseFunction<typeof KEBAB_CASE>
  [PARAM_CASE]: CaseFunction<typeof PARAM_CASE>
  [PASCAL_CASE]: CaseFunction<typeof PASCAL_CASE>
  [SNAKE_CASE]: CaseFunction<typeof SNAKE_CASE>
}

export type StringKeys<O extends Input> = {
  [K in keyof O]: O[K]
}

export type ArrayToCase<
  V extends string,
  C extends Case,
  P extends Prefix = Prefix
> = ToCase<V, C, P>[]

/** Setup optional keys check **/
type Undefined<T extends Input> = {
  [P in keyof T]: P extends undefined ? T[P] : never
}

type FilterFlags<Base extends Input, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}
type AllowedNames<Base extends Input, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base]

type SubType<Base extends Input, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>

/** Extract list of optional keys **/
type OptionalKeys<T extends Input> = Exclude<
  keyof T,
  NonNullable<keyof SubType<Undefined<T>, never>>
>

/** Convert only all provided keys as required **/
type ConvertKeys<T extends Input, C extends Case, P extends Prefix = Prefix> = {
  [K in KeyOf<T> as ToCase<K, C, P>]: T[K]
}

/** Convert only optional keys **/
type ConvertOptional<
  T extends Input,
  C extends Case,
  P extends Prefix = Prefix
> = Partial<ConvertKeys<Pick<T, OptionalKeys<T>>, C, P>>

/** Convert only non-optional keys **/
type ConvertRequired<
  T extends Input,
  C extends Case,
  P extends Prefix = Prefix
> = ConvertKeys<Omit<T, OptionalKeys<T>>, C, P>

/** Preserve optional properties during conversion **/
type KeysToCase<
  T extends Input,
  C extends Case,
  P extends Prefix = Prefix
> = ConvertRequired<T, C, P> & ConvertOptional<T, C, P>

export type CamelCaseKeys<T extends Input> = KeysToCase<T, "camel">
export type ConstantCaseKeys<T extends Input> = KeysToCase<T, "constant">
export type KebabCaseKeys<T extends Input> = KeysToCase<T, "kebab">
export type SnakeCaseKeys<T extends Input> = KeysToCase<T, "snake">
export type PascalCaseKeys<T extends Input> = KeysToCase<T, "pascal">

export type ParamCaseKeys<T extends Input, P extends Prefix> = {
  [K in KeyOf<T> as ParamCase<K, P>]: T[K]
}

export type AnyCaseKeys<O extends Input> =
  | StringKeys<O>
  | CamelCaseKeys<O>
  | ConstantCaseKeys<O>
  | KebabCaseKeys<O>
  | SnakeCaseKeys<O>
  | PascalCaseKeys<O>
