import { ProcessTerminationError } from "../errors"
import { delay } from "../support"
import { PROCESS_ERROR_EVENT, PROCESS_EXIT_EVENT, SIGTERM } from "../types"
import type { ChildProcess, KillOptions } from "../types"

/**
 * Terminates a child childProcess and awaits for a closed state.
 *
 * @remarks
 * Removes any listeners attached to the childProcess.
 *
 * @public
 */
export const kill = async (
  childProcess: ChildProcess,
  options: Partial<KillOptions> = {}
): Promise<void> => {
  try {
    const { timeout, event, signal }: KillOptions = {
      timeout: 5000,
      event: PROCESS_EXIT_EVENT,
      signal: SIGTERM,
      ...options
    }

    // If process already killed, terminate immediately.
    if (childProcess.killed) {
      return
    }

    // If already awaiting a kill event, return previous promise race.
    if (childProcess.killing) {
      return Promise.race([childProcess.killing, delay(timeout)])
    }

    // Attach the first kill race.
    childProcess.killing = Promise.race([
      new Promise<void>((resolve) => {
        // Poll for a killed in case event is already triggered.
        for (let i: number = 0; i < 100; i++) {
          if (childProcess.killed) {
            resolve()
          }
        }
      }),
      new Promise<void>((resolve, reject) => {
        // Await close or exit event before resolving.
        childProcess.once(event, () => {
          resolve()
        })

        // Abort early if an error occurs.
        childProcess.once(PROCESS_ERROR_EVENT, () => {
          reject()
        })

        // Send termination signal.
        childProcess.kill(signal)

        // Resolve if process is already terminated by the time listeners are attached.
        if (childProcess.killed) {
          resolve()
        }
      }),
      delay(timeout)
    ])

    await childProcess.killing

    // Removes all listeners after termination.
    childProcess.removeAllListeners()
  } catch (error) {
    throw new ProcessTerminationError(childProcess.command, error as Error)
  }
}
