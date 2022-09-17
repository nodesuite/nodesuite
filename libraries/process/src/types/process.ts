import type { PerformanceTimer } from "@nodesuite/timer"

import type { ExecutionMethod } from "./methods"
import type { Signal } from "./signals"
import type { ProcessState } from "./states"
import type { NodeChildProcess } from "./vendor"

export interface CloseReason {
  code: number | undefined
  signal: Signal | undefined
}

export type Validate = (message: string) => boolean

export interface ChildProcess extends NodeChildProcess {
  readonly command: string
  readonly method: ExecutionMethod
  readonly timer: PerformanceTimer
  readonly filters: string[]

  state: ProcessState

  killing: Promise<void> | undefined

  untilOpen(): Promise<void>

  untilClose(): Promise<CloseReason>

  untilMessage(validate: Validate, timeout?: number): Promise<string>
}
