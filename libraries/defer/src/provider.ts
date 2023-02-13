import { DeferredPromise } from "./deferral"
import type { Deferral } from "./types"

/**
 * Provide a Deferred Promise instance.
 *
 * @param signal - Optional abort signal to reject root promise.
 *
 * @public
 */
export const defer = <R = void>(signal?: AbortSignal): Deferral<R> =>
  new DeferredPromise<R>(signal)
