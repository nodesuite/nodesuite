import { MessageTimeoutError } from "../errors"
import {
  PROCESS_CLOSE_EVENT,
  PROCESS_DATA_EVENT,
  PROCESS_ERROR_EVENT
} from "../types"
import type { NodeChildProcess, Signal, Validate } from "../types"

/**
 * Awaits a specific message event from a specified child process.
 *
 * @remarks
 * Has a default timeout of 90s.
 *
 * @param childProcess - Spawned child process to monitor.
 * @param command - Optional name of command for debugging.
 *
 * @internal
 */
export const promisifyMessage =
  (childProcess: NodeChildProcess, command?: string) =>
  (validate: Validate, timeout: number = 90000): Promise<string> =>
    new Promise((resolve, reject) => {
      // If a timeout was requested, start a timer to reject promise if reached.
      const timer: NodeJS.Timer = setTimeout(() => {
        const error: Error = new MessageTimeoutError(
          command ?? childProcess.pid,
          timeout
        )
        console.warn(error.message)
        reject(error)
      }, timeout)

      // Abort observer if process closes before a match is found.
      const onClose = (
        code: number | undefined,
        signal: Signal | undefined
      ): void => {
        reject({ code, signal })
      }

      // Abort observer if process errors before a match is found.
      const onError = (error: Error): void => {
        reject({
          error
        })
      }

      // Search messages based on validation function.
      // We must remove this listener upon resolution to avoid memory leaks.
      const onData = (data: Buffer): void => {
        const message: string = data.toString().trim()

        if (!validate(message)) {
          return
        }

        // Clear the rejection timeout.
        clearTimeout(timer)

        console.debug(`Matched awaited message from child process.`, message)

        childProcess.stdout?.off(PROCESS_DATA_EVENT, onData)
        childProcess.stderr?.off(PROCESS_DATA_EVENT, onData)

        childProcess.off(PROCESS_CLOSE_EVENT, onClose)
        childProcess.off(PROCESS_ERROR_EVENT, onError)

        resolve(message)
      }

      childProcess.stdout?.on(PROCESS_DATA_EVENT, onData)
      childProcess.stderr?.on(PROCESS_DATA_EVENT, onData)

      childProcess.once(PROCESS_CLOSE_EVENT, onClose)
      childProcess.once(PROCESS_ERROR_EVENT, onError)
    })
