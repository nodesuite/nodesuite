import { randomInt } from "node:crypto"
import { setTimeout } from "node:timers/promises"

import type { Delay } from "./types"

/**
 * Pauses execution for a specific or randomized duration.
 *
 * @remarks
 * Uses Node built-in timer promise which requires Node v15+.
 *
 * @public
 */
export const delay: Delay = async (min: number, max?: number): Promise<void> =>
  await setTimeout(max ? randomInt(min, max) : min)

/**
 * Pauses execution for a specific or randomized duration.
 *
 * @remarks
 * Alias of `delay()`.
 *
 * @public
 */
export const sleep: Delay = delay

/**
 * Pauses execution for a specific or randomized duration.
 *
 * @remarks
 * Alias of `delay()`.
 *
 * @public
 */
export const waitForTimeout: Delay = delay
