/**
 * Union of javascript primitives.
 *
 * @public
 */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint

/**
 * Abstract class shape.
 *
 * @public
 */
export type Class<T = unknown, Arguments extends any[] = any[]> = new (
  ...arguments_: Arguments
) => T

/**
 * Strong array typing.
 *
 * @public
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

/**
 * Falsy values across several types.
 *
 * @remarks
 * Includes numeric, bigint, empty strings, nulls, undefined.
 *
 * @public
 */
export type Falsy = false | 0 | 0n | "" | null | undefined

/**
 * Null or undefined values.
 *
 * @public
 */
export type Nullish = null | undefined

/**
 * Strip non-string keys.
 *
 * @public
 */
export type KeyOf<O extends object> = Extract<keyof O, string>

/**
 * Only allow string keys.
 *
 * @public
 */
export type AnyRecord = Record<string, any>

/**
 * Strip non-string keys from existing object.
 *
 * @public
 */
export type AsRecord<O extends object> = {
  [K in KeyOf<O>]: O[K]
}

/**
 * Recursive partial of all nested objects.
 *
 * @public
 */
export type DeepPartial<T> = Partial<
  {
    [P in keyof T]: T[P] extends object
      ? T[P] extends Array<any>
        ? T[P]
        : DeepPartial<T[P]>
      : T[P]
  }
>
