import type { ExecutionMethod } from "./methods"
import type { Signal } from "./signals"
import type { ProcessState } from "./states"
import type { NodeChildProcess, Serializable } from "./vendor"

export interface CloseReason {
  code: number | undefined
  signal: Signal | undefined
}

export type Validate<T> = (input: unknown) => T | void

export interface ManagedProcess extends NodeChildProcess {
  readonly command: string
  readonly method: ExecutionMethod

  state: ProcessState

  killing: Promise<void> | undefined

  untilOpen(): Promise<void>

  untilClose(): Promise<CloseReason>

  untilMessage<T extends Serializable = Serializable>(
    validate: Validate<T>
  ): Promise<T>
}
