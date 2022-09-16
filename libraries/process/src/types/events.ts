/**
 * @public
 */
export const [
  PROCESS_CLOSE_EVENT,
  PROCESS_DISCONNECT_EVENT,
  PROCESS_ERROR_EVENT,
  PROCESS_EXIT_EVENT,
  PROCESS_MESSAGE_EVENT,
  PROCESS_OPEN_EVENT,
  PROCESS_SPAWN_EVENT
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
  PROCESS_CLOSE_EVENT,
  PROCESS_DISCONNECT_EVENT,
  PROCESS_ERROR_EVENT,
  PROCESS_EXIT_EVENT,
  PROCESS_MESSAGE_EVENT,
  PROCESS_OPEN_EVENT,
  PROCESS_SPAWN_EVENT
] as const

/**
 * @public
 */
export type ProcessEvent = typeof processEvents[number]

/**
 * @public
 */
export const closeEvents = [PROCESS_CLOSE_EVENT, PROCESS_EXIT_EVENT] as const

/**
 * @public
 */
export type CloseEvent = typeof closeEvents[number]
