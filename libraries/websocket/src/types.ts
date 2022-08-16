import type { ClientRequestArgs } from "node:http"
import type { ClientOptions, RawData, WebSocket } from "ws"

/**
 * List of serializable types which can be sent via websocket.
 *
 * @public
 */
export type Serializable = string | object | number | boolean | bigint

/**
 * Expression of raw Buffer data received from websocket message listener.
 *
 * @public
 */
export type RawWebSocketData = RawData

/**
 * Type guard to test if a value is a valid buffer.
 *
 * @param value - Unknown value to test.
 *
 * @internal
 */
export const isRawWebSocketData = (value: unknown): value is RawWebSocketData =>
  typeof value === "object" &&
  value !== null &&
  ["ArrayBuffer", "Buffer", "Uint8Array"].includes(
    Object.prototype.toString.call(value).slice(8, -1)
  )

/**
 * Provides the default options for the base `ws` class.
 *
 * @public
 */
export type WebSocketOptions = ClientOptions | ClientRequestArgs

/**
 * Export event names as constants.
 *
 * @public
 */
export const [
  OPEN_EVENT,
  MESSAGE_EVENT,
  CLOSE_EVENT,
  ERROR_EVENT,
  PING_EVENT,
  PONG_EVENT
] = ["open", "message", "close", "error", "ping", "pong"] as const

/**
 * Typed array of all event names.
 *
 * @public
 */
export const webSocketEvents = [
  OPEN_EVENT,
  MESSAGE_EVENT,
  CLOSE_EVENT,
  ERROR_EVENT,
  PING_EVENT,
  PONG_EVENT
] as const

export type WebSocketEvent = typeof webSocketEvents[number]

/**
 * Abstract interface for implementing a websocket client.
 *
 * @public
 */
export interface AsyncWebSocket extends WebSocket {
  open(): Promise<this>

  send(data: Serializable): Promise<void>

  close(): Promise<this>

  terminate(ms?: number): Promise<void>

  getAnalytics(): Analytics
}

/**
 * Define the NodeJS `timeout` type.
 *
 * @internal
 */
export type Timer = NodeJS.Timer

/**
 * Analytics emitted by the websocket upon close.
 *
 * @public
 */
export interface Analytics {
  // Messages sent.
  sent: number
  // Messages received.
  received: number
  // Connection timestamp.
  opened: Date | undefined
  // Disconnection timestamp.
  closed: Date | undefined
  // Socket connection duration.
  duration: number | undefined
}
