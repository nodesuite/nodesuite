import type { Callback, Deferral, DeferralBuilder } from "./types"

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
  let _isResolved: boolean = false

  const deferral: Partial<DeferralBuilder<R>> = {
    resolve: undefined,
    reject: undefined,
    promise: undefined,

    isResolved: (): boolean => _isResolved
  }

  const promise: Promise<R> = new Promise<R>((resolve, reject) => {
    deferral.resolve = () => {
      _isResolved = true
      resolve(callback())
    }

    deferral.reject = reject
  })

  deferral.promise = promise
  deferral.untilResolved = async (): Promise<R> => promise

  return Object.freeze(deferral) as Deferral<R>
}
