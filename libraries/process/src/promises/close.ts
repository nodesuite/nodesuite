import { PROCESS_CLOSE_EVENT, PROCESS_ERROR_EVENT } from "../types"
import type { CloseReason, NodeChildProcess, Signal } from "../types"

/**
 * Awaits a close event from a specified child process.
 *
 * @param childProcess - Spawned child process to monitor.
 *
 * @internal
 */
export const promisifyClose =
  (childProcess: NodeChildProcess) => (): Promise<CloseReason> =>
    new Promise<CloseReason>((resolve, reject) => {
      // If process already killed, resolve immediately.
      if (childProcess.killed) {
        resolve({
          code: undefined,
          signal: childProcess.signalCode ?? undefined
        })
      }

      // Listen for close event and resolve with payload.
      childProcess.once(
        PROCESS_CLOSE_EVENT,
        (code: number | undefined, signal: Signal | undefined) => {
          resolve({
            code,
            signal
          })
        }
      )

      // Abort on errors.
      childProcess.once(PROCESS_ERROR_EVENT, (error: Error) => {
        reject({
          error
        })
      })
    })
