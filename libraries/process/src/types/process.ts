import type { PerformanceTimer } from "@nodesuite/timer"

import type { ExecutionMethod } from "./methods"
import type { Signal } from "./signals"
import type { ProcessState } from "./states"
import type { NodeChildProcess, Serializable } from "./vendor"

export interface CloseReason {
  code: number | undefined
  signal: Signal | undefined
}

export type Validate<T> = (input: unknown) => T | void

export interface ChildProcess extends NodeChildProcess {
  readonly command: string
  readonly method: ExecutionMethod
  readonly timer: PerformanceTimer

  state: ProcessState

  killing: Promise<void> | undefined

  untilOpen(): Promise<void>

  untilClose(): Promise<CloseReason>

  untilMessage<T extends Serializable = Serializable>(
    validate: Validate<T>
  ): Promise<T>
}
