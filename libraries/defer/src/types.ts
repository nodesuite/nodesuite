/**
 * @public
 */
export type Callback<R> = () => R

/**
 * @public
 */
export type Resolver<R = void> = (value: R) => void

/**
 * @public
 */
export type Rejection = (reason?: string | Error | unknown) => void

/**
 * @public
 */
export interface Deferral<R = void> {
  // Original promise to await.
  readonly promise: Promise<R>
  // Internal resolve function.
  readonly resolve: Resolver<R>
  // Internal reject function.
  readonly reject: Rejection

  // Sugar syntax to avoid using promise object.
  readonly untilResolved: () => Promise<R>
}

/**
 * @internal
 */
export interface Builder<R = void> {
  promise?: Promise<R> | undefined
  resolve?: Resolver<R> | undefined
  reject?: Rejection | undefined
  untilResolved?: () => Promise<R>
}
