import type { Schema } from "./input"
import type { Options } from "./output"
import type { Serializable } from "./serialization"

/**
 * Intermediate map used for accumulation.
 *
 * @public
 */
export type ReducerMap<Output extends Options> = Map<
  keyof Output | string,
  Output[keyof Output] | Serializable | undefined
>

/**
 * Key-value entry array from reduce method.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @public
 */
export type ReducerInput<Input extends Schema> = [
  keyof Input,
  Input[keyof Input]
]

/**
 * Typed reducer function passed to mutation function.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @public
 */
export type Reducer<Input extends Schema, Output extends Options> = (
  map: ReducerMap<Output>,
  input: ReducerInput<Input>
) => ReducerMap<Output>

/**
 * Mutates an object via a typed reducer.
 *
 * @remarks
 * Explodes an object to entries, then passes each entry through a reducer before imploding back to output object.
 *
 *
 * @public
 */
export type Pipe<Input extends Schema, Output extends Options> = (
  source: Input,
  reducer: Reducer<Input, Output>
) => Output
