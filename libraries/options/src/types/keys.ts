import type { AnyRecord } from "@nodesuite/is"

import type { Serializable } from "./serialization"

/**
 * Strips undefined or null values from an object.
 *
 * @public
 */
export type StrippedObject<O extends Record<string, Serializable | undefined>> =
  {
    [Key in keyof O]-?: NonNullable<O[Key]>
  }

/**
 * Strips keys not present in filter array from object.
 * Optionally strips nullish values.
 *
 * @public
 */
export type FilteredObject<
  K extends string,
  O extends AnyRecord,
  S extends boolean = false
> = S extends true
  ? StrippedObject<
      {
        [Key in K]: O[Key]
      }
    >
  : {
      [Key in K]: O[Key]
    }
