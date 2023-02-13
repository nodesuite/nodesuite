/**
 * Resolve method signature.
 *
 * @public
 */
export type Resolver<R = void> = (value: R) => void

/**
 * Reject method signature.
 *
 * @public
 */
export type Rejection = (reason?: string | Error | unknown) => void

/**
 * Abstract deferred promise.
 *
 * @public
 */
export interface Deferral<R = void> {
  /** Abort signal, if provided at construction. */
  readonly signal?: AbortSignal

  /** Root promise instance. */
  promise(): Promise<R>

  /** Internal resolve function. */
  resolve(value: R): void

  /** Reject root promise. */
  reject(reason?: string | Error | unknown): void

  /** Alias to await root promise. */
  untilResolved(): Promise<R>

  /** Test if deferral has already been resolved or rejected. */
  isComplete(): boolean
}
