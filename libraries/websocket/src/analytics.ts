import type { Analytics } from "./types"

/**
 * Generates an empty analytics object for websocket monitoring.
 *
 * @internal
 */
export const createAnalytics = (): Analytics => ({
  sent: 0,
  received: 0,
  opened: undefined,
  closed: undefined,
  duration: undefined
})

/**
 * Calculates the duration in ms between open and close timestamps.
 *
 * @param opened - Date object representing open time.
 * @param closed - Date object representing close time.
 *
 * @internal
 */
export const getDuration = ({
  opened,
  closed
}: Pick<Analytics, "opened" | "closed">): number | undefined =>
  opened && closed ? closed.getTime() - opened.getTime() : undefined
