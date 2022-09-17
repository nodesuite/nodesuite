import type EventEmitter from "node:events"

import type { ChildProcess } from "./process"

export interface ManagedProcess extends EventEmitter {
  readonly command: string | undefined

  readonly pid: number | undefined

  process(): ChildProcess
}
