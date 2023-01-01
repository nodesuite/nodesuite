import init from "debug"
import type { Debugger } from "debug"

/**
 * Container debugger.
 *
 * @internal
 */
export const debug: Debugger = init("container")
