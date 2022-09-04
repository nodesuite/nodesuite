import type { PartialDeep } from "type-fest"

/**
 * Partial abstract options object.
 *
 * @public
 */
export type PartialOptions<O extends object> = PartialDeep<O>

/**
 * Intermediate options extracted from sources with string values.
 *
 * @public
 */
export type RawOptions<K extends string = string> = Partial<
  Record<K, string> & {
    _: string[]
  }
>

/**
 * Callback function to handle parsing prior to returning.
 *
 * @remarks
 * This keeps parsing concern abstract, but ensures the configure function returns a valid output.
 *
 * @public
 */
export type OptionsParser<O extends object> = (options: object) => O
