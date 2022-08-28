import { isFunction } from "@nodesuite/is"

import type { Deserialize, Serializable, Serialize } from "./serialization"

export interface Cast<T extends Serializable = Serializable> {
  type: Serialize<T>
  defaultValue?: T
  optional?: boolean
}

export type Handler<T extends Serializable = Serializable> = (
  value: Serializable | undefined
) => T

export type Schema = Record<string, Cast | Handler>

export const isCast = <T extends Serializable = Serializable>(
  castOrHandler: Cast<T> | Handler<T>
): castOrHandler is Cast<T> => !isFunction(castOrHandler)

export const isHandler = <T extends Serializable = Serializable>(
  castOrHandler: Cast<T> | Handler<T>
): castOrHandler is Handler<T> => isFunction(castOrHandler)

export type RawOptions<K extends string> = Partial<Record<K, string>>

export type ParseCast<C extends Cast> = Extract<
  C["optional"],
  true
> extends never
  ? Deserialize<C["type"]>
  : Deserialize<C["type"]> | undefined

export type ParseHandler<H extends Handler> = ReturnType<H>

export type Parse<C extends Cast | Handler> = C extends Handler
  ? ParseHandler<C>
  : C extends Cast
  ? ParseCast<C>
  : never

export type Options<S extends Schema> = {
  [K in keyof S]: Parse<S[K]>
}
