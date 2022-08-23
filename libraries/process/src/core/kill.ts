import { delay, ProcessTerminationError } from "../support"
import { ERROR_EVENT, EXIT_EVENT, SIGTERM } from "../types"
import type { KillOptions, ManagedProcess } from "../types"

/**
 * Terminates a child managedProcess and awaits for a closed state.
 *
 * @remarks
 * Removes any listeners attached to the managedProcess.
 *
 * @public
 */
export const kill = async (
  managedProcess: ManagedProcess,
  options: Partial<KillOptions> = {}
): Promise<void> => {
  try {
    const { timeout, event, signal }: KillOptions = {
      timeout: 5000,
      event: EXIT_EVENT,
      signal: SIGTERM,
      ...options
    }

    // If process already killed, terminate immediately.
    if (managedProcess.killed) {
      return
    }

    // If already awaiting a kill event, return previous promise race.
    if (managedProcess.killing) {
      return Promise.race([managedProcess.killing, delay(timeout)])
    }

    // Attach the first kill race.
    managedProcess.killing = Promise.race([
      new Promise<void>((resolve) => {
        // Poll for a killed in case event is already triggered.
        for (let i: number = 0; i < 100; i++) {
          if (managedProcess.killed) {
            resolve()
          }
        }
      }),
      new Promise<void>((resolve, reject) => {
        // Await close or exit event before resolving.
        managedProcess.once(event, () => {
          resolve()
        })

        // Abort early if an error occurs.
        managedProcess.once(ERROR_EVENT, () => {
          reject()
        })

        // Send termination signal.
        managedProcess.kill(signal)

        // Resolve if process is already terminated by the time listeners are attached.
        if (managedProcess.killed) {
          resolve()
        }
      }),
      delay(timeout)
    ])

    await managedProcess.killing

    // Removes all listeners after termination.
    managedProcess.removeAllListeners()
  } catch (error) {
    throw new ProcessTerminationError(managedProcess.command, error as Error)
  }
}
