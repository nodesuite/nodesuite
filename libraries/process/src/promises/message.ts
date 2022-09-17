import { MessageTimeoutError } from "../errors"
import {
  PROCESS_CLOSE_EVENT,
  PROCESS_ERROR_EVENT,
  PROCESS_MESSAGE_EVENT
} from "../types"
import type { NodeChildProcess, Serializable, Signal, Validate } from "../types"

/**
 * Awaits a specific message event from a specified child process.
 *
 * @remarks
 * Has a default timeout of 120s.
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
    timeout: number = 120000
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
      const onMessage = (data: Buffer): void => {
        const message: T | void = validate(data.toString("utf8"))

        if (!message) {
          return
        }

        console.debug(`Matched awaited message from child process.`, message)

        childProcess.off(PROCESS_MESSAGE_EVENT, onMessage)
        childProcess.off(PROCESS_CLOSE_EVENT, onClose)
        childProcess.off(PROCESS_ERROR_EVENT, onError)
        resolve(message)
      }

      childProcess.on(PROCESS_MESSAGE_EVENT, onMessage)
      childProcess.once(PROCESS_CLOSE_EVENT, onClose)
      childProcess.once(PROCESS_ERROR_EVENT, onError)

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
