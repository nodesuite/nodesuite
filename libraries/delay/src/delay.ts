import { randomInt } from "node:crypto"

import type { Delay } from "./types"

/**
 * Pauses execution for a specific or randomized duration.
 *
 * @public
 */
export const delay: Delay = async (min: number, max?: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(
      () => {
        resolve()
      },
      max ? randomInt(min, max) : min
    )
  })

/**
 * Pauses execution for a specific or randomized duration.
 *
 * @public
 */
export const sleep: Delay = delay

/**
 * Pauses execution for a specific or randomized duration.
 *
 * @public
 */
export const waitForTimeout: Delay = delay
