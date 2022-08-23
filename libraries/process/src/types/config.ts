import type { CloseEvent } from "./events"
import type { Options } from "./options"
import type { Signal } from "./signals"

/**
 * @public
 */
export interface ProcessConfig<O extends Options> {
  command?: string
  args: string[]
  options: O
}

/**
 * @public
 */
export interface KillOptions {
  timeout: number
  signal: Signal
  event: CloseEvent
}
