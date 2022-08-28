import type { Cast, Handler, Parser, Schema } from "./input"
import type { Deserialize, Serializable } from "./serialization"

/**
 * Intermediate options extracted from sources with string values.
 *
 * @public
 */
export type RawOptions<K extends PropertyKey = PropertyKey> = Partial<
  Record<K, string | undefined>
>

/**
 * Output from Cast parser or provided Handler.
 *
 * @public
 */
export type ParsedOption<P extends Parser> = P extends Handler
  ? ReturnType<P>
  : P extends Cast
  ? Extract<P["optional"], true> extends never
    ? Deserialize<P["type"]>
    : Deserialize<P["type"]> | undefined
  : never

/**
 * Abstract options prior to filtering.
 *
 * @public
 */
export type Options<K extends PropertyKey = PropertyKey> = Record<
  K,
  Serializable | undefined
>

/**
 * Final options interface.
 *
 * @public
 */
export type InferOptions<S extends Schema> = {
  [K in keyof S]: ParsedOption<S[K]>
}
