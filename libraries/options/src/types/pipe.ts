import type { KeyOf, ValueOf } from "@nodesuite/is"

import type { Schema } from "./schema"
import type { Serializable, SerializedRecord } from "./serialization"

export type ReducerMap<Output extends SerializedRecord> = Map<
  KeyOf<Output> | string,
  ValueOf<Output> | Serializable | undefined
>

export type ReducerInput<Input extends Schema> = [KeyOf<Input>, ValueOf<Input>]

export type Reducer<Input extends Schema, Output extends SerializedRecord> = (
  map: ReducerMap<Output>,
  input: ReducerInput<Input>
) => ReducerMap<Output>

export type Pipe<Input extends Schema, Output extends SerializedRecord> = (
  source: Input,
  reducer: Reducer<Input, Output>
) => Output
