import type { Builder, Callback, Deferral } from "./types"

/**
 * Default void callback.
 *
 * @internal
 */
const NOOP =
  <R>(): Callback<R> =>
  (): R =>
    undefined as unknown as R

/**
 * Provide a deferred Promise object.
 *
 * @public
 */
export const defer = <R = void>(
  callback: Callback<R> = NOOP()
): Deferral<R> => {
  const deferral: Builder<R> = {}

  const promise: Promise<R> = new Promise<R>((resolve, reject) => {
    deferral.resolve = () => {
      resolve(callback())
    }

    deferral.reject = reject
  })

  deferral.promise = promise
  deferral.untilResolved = async (): Promise<R> => promise

  return deferral as Deferral<R>
}
