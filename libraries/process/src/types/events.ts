/**
 * @public
 */
export const [
  CLOSE_EVENT,
  DISCONNECT_EVENT,
  ERROR_EVENT,
  EXIT_EVENT,
  MESSAGE_EVENT,
  OPEN_EVENT,
  SPAWN_EVENT
] = [
  "close",
  "disconnect",
  "error",
  "exit",
  "message",
  "open",
  "spawn"
] as const

/**
 * @public
 */
export const processEvents = [
  CLOSE_EVENT,
  DISCONNECT_EVENT,
  ERROR_EVENT,
  EXIT_EVENT,
  MESSAGE_EVENT,
  SPAWN_EVENT
] as const

/**
 * @public
 */
export type ProcessEvent = typeof processEvents[number]

/**
 * @public
 */
export const closeEvents = [CLOSE_EVENT, EXIT_EVENT] as const

/**
 * @public
 */
export type CloseEvent = typeof closeEvents[number]
