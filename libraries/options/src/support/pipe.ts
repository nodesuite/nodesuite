import type {
  Reducer,
  ReducerInput,
  ReducerMap,
  Schema,
  SerializedRecord
} from "../types"

/**
 * Runs a source object through a reducer to and exports type result.
 *
 * @param source - Source object to process.
 * @param reducer - Map-based reducer function.
 *
 * @internal
 */
export const pipe = <Input extends Schema, Output extends SerializedRecord>(
  source: Input,
  reducer: Reducer<Input, Output>
): Output => {
  const entries = Object.entries(source).reduce(
    (map, input) => reducer(map, input as ReducerInput<Input>),
    new Map() as ReducerMap<Output>
  )

  return Object.fromEntries(entries) as Output
}
