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
export interface DeferralBuilder<R = void> {
  // Original promise to await.
  promise: Promise<R>
  // Internal resolve function.
  resolve: Resolver<R>
  // Internal reject function.
  reject: Rejection

  // Test if deferral has already been resolved.
  isResolved(): boolean

  // Sugar syntax to avoid using promise object.
  untilResolved(): Promise<R>
}

export type Deferral<R = void> = Readonly<DeferralBuilder<R>>
