import type { KeyOf } from "@nodesuite/is"

import type { Options } from "../types"
import type {
  RawOptions,
  Reducer,
  ReducerInput,
  ReducerMap,
  Schema
} from "../types"

/**
 * Runs a source object through a reducer to and exports type result.
 *
 * @param source - Source object to process.
 * @param reducer - Map-based reducer function.
 * @param initialState - Optional starting values for map accumulator.
 *
 * @internal
 */
export const pipe = <Input extends Schema, Output extends Options>(
  source: Input,
  reducer: Reducer<Input, Output>,
  initialState: RawOptions<KeyOf<Output>> = {}
): Output => {
  const entries = Object.entries(source).reduce(
    (map, input) => reducer(map, input as ReducerInput<Input>),
    new Map(Object.entries(initialState)) as ReducerMap<Output>
  )

  return Object.fromEntries(entries) as Output
}
