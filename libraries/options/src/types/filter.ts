/**
 * Strips undefined or null values from an object.
 *
 * @remarks
 * Used to remove undefined values from intermediate raw records.
 *
 * @public
 */
type StrippedObject<O extends object> = {
  [K in keyof O]-?: NonNullable<O[K]>
}

/**
 * Strips keys not present in filter array from object.
 * Optionally strips nullish values.
 *
 * @remarks
 * Used on flattened
 *
 * @public
 */
export type FilteredObject<
  O extends object,
  K extends keyof O
> = StrippedObject<
  {
    [FK in K]: O[FK]
  }
>
