import { MessageTimeoutError } from "../errors"
import { CLOSE_EVENT, ERROR_EVENT, MESSAGE_EVENT } from "../types"
import type { NodeChildProcess, Serializable, Signal, Validate } from "../types"

/**
 * Awaits a specific message event from a specified child process.
 *
 * @param childProcess - Spawned child process to monitor.
 * @param command - Optional name of command for debugging.
 *
 * @internal
 */
export const promisifyMessage =
  (childProcess: NodeChildProcess, command?: string) =>
  <T extends Serializable = Serializable>(
    validate: Validate<T>,
    timeout?: number
  ): Promise<T> =>
    new Promise<T>((resolve, reject) => {
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

      // Matching logic, generally a Zod schema or function that throws if invalid.
      // We must remove this listener upon resolution to avoid memory leaks.
      const onMessage = (stdout: Serializable): void => {
        const message: T | void = validate(stdout)

        if (!message) {
          return
        }

        console.debug(`Matched awaited message from child process.`, message)

        childProcess.off(MESSAGE_EVENT, onMessage)
        childProcess.off(CLOSE_EVENT, onClose)
        childProcess.off(ERROR_EVENT, onError)
        resolve(message)
      }

      childProcess.on(MESSAGE_EVENT, onMessage)
      childProcess.once(CLOSE_EVENT, onClose)
      childProcess.once(ERROR_EVENT, onError)

      // If a timeout was requested, abort if reached.
      if (timeout) {
        setTimeout(() => {
          const error: Error = new MessageTimeoutError(
            command ?? childProcess.pid,
            timeout
          )
          console.warn(error.message)
          reject(error)
        }, timeout)
      }
    })
