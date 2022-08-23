import { promisifyClose, promisifyMessage, promisifyOpen } from "../promises"
import {
  CLOSE_EVENT,
  CLOSED_STATE,
  ERROR_EVENT,
  OPENED_STATE,
  SPAWN_EVENT
} from "../types"
import type { ManagedProcess, NodeChildProcess } from "../types"

/**
 * Utility function to append several management tools to a spawned or forked process.
 *
 * @remarks
 * This function should not be called directly, only indirectly via `spawn` or `fork`.
 *
 * @param childProcess - Native child process to augment.
 * @param command - Command name or executable path called by `spawn` or `fork`.
 * @param method - Execution method (`spawn`, `fork`) used to spawn the process.
 *
 * @internal
 */
export const manage = (
  childProcess: NodeChildProcess,
  { command, method }: Pick<ManagedProcess, "command" | "method">
): ManagedProcess => {
  // Attach the additional "management" properties to the base child process.
  const managedProcess: ManagedProcess = Object.assign(childProcess, {
    command,
    method,
    killing: undefined,
    state: CLOSED_STATE,
    untilOpen: promisifyOpen(childProcess, command),
    untilClose: promisifyClose(childProcess),
    untilMessage: promisifyMessage(childProcess, command)
  })

  // Change state and notify debugger on state changes.

  managedProcess.once(SPAWN_EVENT, () => {
    managedProcess.state = OPENED_STATE
    console.debug(`Process "${command}" opened.`)
  })

  managedProcess.once(CLOSE_EVENT, () => {
    managedProcess.state = CLOSED_STATE
    console.debug(`Process "${command}" closed.`)
  })

  managedProcess.on(ERROR_EVENT, (error: Error) => {
    console.debug(`Process "${command}" error: ${error.message}`)
  })

  return managedProcess
}
