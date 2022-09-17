import { Timer } from "@nodesuite/timer"
import type { PerformanceTimer } from "@nodesuite/timer"

import { promisifyClose, promisifyMessage, promisifyOpen } from "../promises"
import {
  PROCESS_CLOSE_EVENT,
  PROCESS_CLOSED_STATE,
  PROCESS_DATA_EVENT,
  PROCESS_ERROR_EVENT,
  PROCESS_OPENED_STATE,
  PROCESS_OPENING_STATE,
  PROCESS_SPAWN_EVENT,
  SIGTERM
} from "../types"
import type { ChildProcess, NodeChildProcess } from "../types"

/**
 * Utility function to append several management tools to a spawned or forked process.
 *
 * @remarks
 * This function should not be called directly, only indirectly via `spawn` or `fork`.
 *
 * @param nativeChildProcess - Native child process to augment.
 * @param command - Command name or executable path called by `spawn` or `fork`.
 * @param method - Execution method (`spawn`, `fork`) used to spawn the process.
 * @param filters - String filters used to reduce stdout and stderr noise.
 *
 * @internal
 */
export const manage = (
  nativeChildProcess: NodeChildProcess,
  {
    command,
    method,
    filters
  }: Pick<ChildProcess, "command" | "method" | "filters">
): ChildProcess => {
  // Initialize a timer to track duration.
  const timer: PerformanceTimer = new Timer()

  // Attach the additional "management" properties to the base child process.
  const childProcess: ChildProcess = Object.assign(nativeChildProcess, {
    command,
    method,
    timer,
    filters,
    killing: undefined,
    state: PROCESS_OPENING_STATE,
    untilOpen: promisifyOpen(nativeChildProcess, command),
    untilClose: promisifyClose(nativeChildProcess),
    untilMessage: promisifyMessage(nativeChildProcess, command)
  })

  // Change state and notify debugger on state changes.

  childProcess.once(PROCESS_SPAWN_EVENT, () => {
    childProcess.state = PROCESS_OPENED_STATE
    console.debug(`Process "${command}" opened.`)
  })

  childProcess.once(PROCESS_CLOSE_EVENT, () => {
    childProcess.state = PROCESS_CLOSED_STATE
    console.debug(`Process "${command}" closed.`)
  })

  childProcess.on(PROCESS_ERROR_EVENT, (error: Error) => {
    console.debug(`Process "${command}" error: ${error.message}`)
    if (!childProcess.killed) {
      childProcess.kill(SIGTERM)
    }
  })

  const filter = (data: Buffer): string | undefined => {
    const message: string = data.toString().trim()
    return !childProcess.filters ||
      childProcess.filters.every((filter) => !message.includes(filter))
      ? message
      : undefined
  }

  const onStdout = (data: Buffer): void => {
    const message: string | undefined = filter(data)
    if (message) {
      process.stdout.write(`${message}\n`)
    }
  }

  const onStderr = (data: Buffer): void => {
    const message: string | undefined = filter(data)
    if (message) {
      process.stderr.write(`${message}\n`)
    }
  }

  if (childProcess.stdout) {
    childProcess.stdout.on(PROCESS_DATA_EVENT, onStdout)
  }

  if (childProcess.stderr) {
    childProcess.stderr.on(PROCESS_DATA_EVENT, onStderr)
  }

  return childProcess
}
