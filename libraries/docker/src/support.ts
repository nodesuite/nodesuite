import { randomInt } from "node:crypto"
import init from "debug"
import { check } from "tcp-port-used"
import type { Debugger } from "debug"

import { MAX_PORT, MIN_PORT } from "./constants"
import { NoAvailablePortsError } from "./exceptions"

/**
 * Container debugger.
 *
 * @internal
 */
export const debug: Debugger = init("container")

/**
 * Attempts to identify an available port.
 *
 * @remarks
 * Attempts to find a port in range for 100 attempts.
 * Will throw if no available ports can be found.
 *
 *
 * @param min - Minimum port to search.
 * @param max - Maximum port to search.
 *
 * @public
 */
export const findPort = async (
  min: number = MIN_PORT,
  max: number = MAX_PORT
): Promise<number> => {
  const attempts: number = 100
  for (let i: number = 0; i < attempts; i++) {
    const port: number = randomInt(min, max)
    const isAvailable: boolean = !(await check(port))
    if (isAvailable) {
      return port
    }
  }

  throw new NoAvailablePortsError(min, max, attempts)
}
