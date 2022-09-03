import type { DeepPartial } from "@nodesuite/is"

/**
 * Partial abstract options object.
 *
 * @public
 */
export type PartialOptions<O extends object> = DeepPartial<O>

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
