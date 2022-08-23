import { OpenTimeoutError } from "../errors"
import { ERROR_EVENT, SPAWN_EVENT } from "../types"
import type { NodeChildProcess } from "../types"

/**
 * Awaits a `spawn` event from a specified child process.
 *
 * @param childProcess - Spawned child process to monitor.
 * @param command - Optional name of command for debugging.
 *
 * @internal
 */
export const promisifyOpen =
  (childProcess: NodeChildProcess, command?: string) =>
  async (timeout?: number): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      // If process already open, return immediately.
      if (childProcess.pid) {
        resolve()
      }

      // Do not await killed processes.
      if (childProcess.killed) {
        reject(`Cannot await open on killed process.`)
      }

      // Abort on errors while spawning.
      const onError = (error?: Error): void => {
        reject(error)
      }

      // Handle successful spawn event.
      const onSpawn = (): void => {
        // Remove abort listener.
        childProcess.removeListener(ERROR_EVENT, onError)

        // Once process is spawned, convert to observable.
        resolve()
      }

      // Bind listeners.
      childProcess.once(ERROR_EVENT, onError)
      childProcess.once(SPAWN_EVENT, onSpawn)

      // If a timeout was requested, abort if reached.
      if (timeout) {
        setTimeout(() => {
          const error: Error = new OpenTimeoutError(
            command ?? childProcess.pid,
            timeout
          )
          console.warn(error.message)
          reject(error)
        }, timeout)
      }
    })
