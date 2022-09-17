import type EventEmitter from "node:events"

import type { ChildProcess } from "./process"

/**
 * Abstract process manager interface.
 *
 * @public
 */
export interface ManagedProcess extends EventEmitter {
  // Path to the executable.
  readonly command: string | undefined

  // Process id of internal child process.
  readonly pid: number | undefined

  // Expose internal child process.
  process(): ChildProcess
}
