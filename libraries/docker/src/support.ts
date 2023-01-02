import { randomInt } from "node:crypto"
import init from "debug"
import { check } from "tcp-port-used"
import type { Debugger } from "debug"

import { MAX_PORT, MIN_PORT } from "./constants"
import { NoAvailablePortsError } from "./exceptions"
import type { ContainerPorts } from "./types"

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

/**
 * Extracts a final port number from any of the possible external port
 * definitions.
 *
 * @public
 */
export const extractPorts = async (
  external: number | [number, number] | ContainerPorts,
  internal?: number
): Promise<[number, number]> => {
  // If number params provided, allow second param to be used as internal.
  if (typeof external === "number") {
    const port: number = await findPort(external, external)
    return [port, internal ?? port]
  }

  if (typeof external === "object") {
    if (Array.isArray(external)) {
      // If positional array, use first element as external, second as internal.
      const port: number = await findPort(external[0], external[1])
      return [port, internal ?? port]
    } else {
      // If a definition object was provided, use its components.
      return await extractPorts(external.external, external.internal)
    }
  }

  throw new Error(`Invalid port type provided.`)
}
