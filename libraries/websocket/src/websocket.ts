import { WebSocket as BaseWebSocket } from "ws"

import { createAnalytics, getDuration } from "./analytics"
import { UnexpectedCloseError } from "./errors"
import { serialize } from "./serialization"
import { CLOSE_EVENT, ERROR_EVENT, OPEN_EVENT, PONG_EVENT } from "./types"
import type { Analytics, AsyncWebSocket, Serializable, Timer } from "./types"

/**
 * Default timeout in ms to wait for heartbeat response from server.
 *
 * @public
 */
export const DEFAULT_HEARTBEAT_TIMEOUT: number = 30000

/**
 * Default timeout in ms to wait before sending a termination signal.
 *
 * @public
 */
export const DEFAULT_TERMINATION_TIMEOUT: number = 1000

/**
 *
 * Asynchronous WebSocket
 *
 * @remarks
 * Augmentation of the popular `ws` class which provides async
 * methods rather than callbacks.
 *
 * @see https://github.com/websockets/ws/blob/master/doc/ws.md
 *
 * @public
 */
export class WebSocket extends BaseWebSocket implements AsyncWebSocket {
  /**
   * Heartbeat timeout which resets periodically.
   *
   * @internal
   */
  #timeout: Timer | undefined

  /**
   * Prevents multiple open calls by attaching a promise to the first attempt.
   *
   * @internal
   */
  #opening: Promise<this> | undefined

  /**
   * Prevents multiple close calls by attaching a promise to the first attempt.
   *
   * @internal
   */
  #closing: Promise<this> | undefined

  /**
   * Prevents multiple terminate calls by attaching a promise to the first
   * attempt.
   *
   * @internal
   */
  #terminating: Promise<void> | undefined

  /**
   * Private analytics state.
   *
   * @internal
   */
  #analytics: Analytics = createAnalytics()

  /**
   * Awaits the initial open event.
   *
   * @remarks
   * As the base websocket class begins a connection immediately upon
   * construction, this allows asynchronous awaiting of a successful open event.
   *
   *
   * @example
   * ```
   * const client = await new WebSocket().open()
   * ```
   *
   * @public
   */
  public async open(): Promise<this> {
    return (
      this.#opening ??
      (this.#opening = new Promise<this>((resolve, reject) => {
        const onError = (error: Error): void => {
          console.error(error.message)
          this.terminate().catch(reject)
          reject(error)
        }

        const onClose = (): void => {
          this.terminate().catch(reject)
          reject(new UnexpectedCloseError(this.url))
        }

        const onOpen = (): void => {
          this.keepAlive()
          this.off(ERROR_EVENT, onError)
          this.off(CLOSE_EVENT, onClose)
          resolve(this)
        }

        if (this.OPEN) {
          onOpen()
        } else {
          this.once(OPEN_EVENT, onOpen)
          this.once(ERROR_EVENT, onError)
          this.once(CLOSE_EVENT, onClose)
        }
      }))
    )
  }

  /**
   * Asynchronous send which awaits confirmation of transmission.
   *
   * @param data - Serializable data to send to the websocket server.
   *
   * @public
   */
  public override async send(data: Serializable): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      super.send(serialize(data), (error?: Error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Asynchronous close which sends a forceful termination after a timeout
   * if close has not completed gracefully.
   *
   * @public
   */
  public override async close(): Promise<this> {
    return (
      this.#closing ??
      (this.#closing = new Promise<this>((resolve, reject) => {
        if (this.CLOSED) {
          resolve(this)
        }

        const onClose = (): void => {
          console.debug(`WebSocket closed gracefully.`)
          resolve(this)
        }

        const onError = (error: Error): void => {
          console.debug(
            `WebSocket encountered error while closing.`,
            error.message
          )
          reject(error)
        }

        this.once(CLOSE_EVENT, onClose)
        this.once(ERROR_EVENT, onError)

        super.close()

        this.terminate().catch(reject)
      }))
    )
  }

  /**
   * Asynchronous terminate with optional timeout.
   *
   * @remarks
   * Removes all listeners upon completion to free up memory.
   *
   * @param ms - Timeout to wait before sending termination event.
   *
   * @public
   */
  public override async terminate(
    ms: number = DEFAULT_TERMINATION_TIMEOUT
  ): Promise<void> {
    return (
      this.#terminating ??
      (this.#terminating = new Promise<void>((resolve) => {
        setTimeout(() => {
          if (!this.CLOSED) {
            console.debug(
              `WebSocket "${this.url}" was not closed after ${ms}ms, sending termination.`
            )
            super.terminate()
          }
          this.removeAllListeners()
          resolve()
        }, ms)
      }))
    )
  }

  /**
   * Attaches a heartbeat ping to the server to detect if connection drops
   * without a close handshake.
   *
   * @param ms - Heartbeat timeout in milliseconds.
   *
   * @public
   */
  public keepAlive(ms: number = DEFAULT_HEARTBEAT_TIMEOUT): void {
    if (!this.#timeout) {
      const clear = (): void => clearTimeout(this.#timeout)

      const reset = (): void => {
        clear()
        this.#timeout = setTimeout(async () => this.terminate(), ms * 1.05)
        this.ping()
      }

      this.once(OPEN_EVENT, () => reset())
      this.once(CLOSE_EVENT, () => clear())
      this.on(PONG_EVENT, () => reset())

      console.debug(
        `WebSocket keep-alive heartbeat attached with ${ms} timeout.`
      )
    }
  }

  /**
   * Provides state in time copy of connection analytics.
   *
   * @public
   */
  public getAnalytics(): Analytics {
    const { sent, received, opened, closed } = this.#analytics
    return {
      sent,
      received,
      opened,
      closed,
      duration: getDuration({ opened, closed })
    }
  }
}
