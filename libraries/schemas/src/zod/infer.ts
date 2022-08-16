import type { z } from "zod"

/**
 * Fallback inference type.
 *
 * @internal
 */
type IsAny<T> = [any extends T ? "true" : "false"] extends ["true"]
  ? true
  : false

/**
 * Equality operator type.
 *
 * @internal
 */
type Equals<X, Y> = [X] extends [Y] ? ([Y] extends [X] ? true : false) : false

/**
 * Attempts to reverse a possible schema type.
 *
 * @internal
 */
type Reverse<
  V extends string,
  O extends string = string,
  K extends [V, ...O[]][number] = [V, ...O[]][number],
  E extends [K, ...string[]] = [K, ...string[]]
> = E

/**
 * Casts a type as union between a base type or preprocessed type.
 *
 * @internal
 */
type As<T extends z.ZodType, A> = T | z.ZodEffects<T, A, A | string>

/**
 * Infers the Zod Schema format of a provided type.
 *
 * @remarks
 * This is used to invert the control of Zod schemas to avoid the complex type
 * extraction Zod performs with its own `z.infer()` utility.
 *
 * This is a hard fork of the original `toZod` library to include enum types.
 *
 * @see https://github.com/colinhacks/tozod/issues/6
 *
 * @public
 */
export type InferSchema<T> = IsAny<T> extends true
  ? never
  : [T] extends [boolean]
  ? As<z.ZodBoolean, boolean>
  : [undefined] extends [T]
  ? T extends undefined
    ? never
    : z.ZodOptional<InferSchema<T>> | z.ZodDefault<InferSchema<T>>
  : [null] extends [T]
  ? T extends null
    ? never
    : z.ZodNullable<InferSchema<T>>
  : T extends Array<infer U>
  ? z.ZodArray<InferSchema<U>>
  : T extends Promise<infer U>
  ? z.ZodPromise<InferSchema<U>>
  : Equals<T, string> extends true
  ? As<z.ZodString, string>
  : Equals<T, bigint> extends true
  ? As<z.ZodBigInt, bigint>
  : Equals<T, number> extends true
  ? As<z.ZodNumber, number>
  : Equals<T, Date> extends true
  ? As<z.ZodDate, Date>
  : T extends {
      [K: string | symbol | number]: any
    }
  ? z.ZodObject<
      { [K in keyof T]-?: InferSchema<T[K]> },
      "strip",
      z.ZodTypeAny,
      T,
      T
    >
  : T extends [string, ...string[]][number]
  ? z.ZodEnum<Reverse<T>>
  : never
