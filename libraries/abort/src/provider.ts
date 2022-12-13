import { Abort } from "./abort"
import type { AbortManager } from "./types"

/**
 * Creates a new `AbortManager` instance.
 *
 * @public
 */
export const createAbort = (): AbortManager => new Abort()
