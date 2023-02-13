import type { Deferral, Rejection, Resolver } from "./types"

/**
 * Deferred Promise
 *
 * @remarks
 * Allows extraction of a root promise's resolve/reject methods to use
 * outside the promise context.
 *
 * @public
 */
export class DeferredPromise<R = void> implements Deferral<R> {
  /**
   * Optional abort signal provided at construction.
   *
   * @remarks
   * When triggered, will reject root promise.
   *
   * @internal
   */
  readonly #signal: AbortSignal | undefined

  /**
   * Internal root promise instance.
   *
   * @internal
   */
  readonly #promise: Promise<R>

  /**
   * Extracted resolve method.
   *
   * @internal
   */
  #resolve: Resolver<R> | undefined

  /**
   * Extracted reject method.
   *
   * @internal
   */
  #reject: Rejection | undefined

  /**
   * Tracks promise state.
   *
   * @internal
   */
  #isComplete: boolean = false

  /**
   * Constructor.
   *
   * @param signal - Optional abort signal to reject root promise.
   *
   * @public
   */
  public constructor(signal?: AbortSignal) {
    this.#signal = signal
    signal?.addEventListener("abort", this.#onReject.bind(this), { once: true })

    this.#promise = new Promise<R>((resolve, reject) => {
      this.#resolve = resolve
      this.#reject = reject
    })
  }

  /**
   * Exposes any provided abort signal.
   *
   * @public
   */
  public get signal(): AbortSignal | undefined {
    return this.#signal
  }

  /**
   * Returns root promise.
   *
   * @public
   */
  public promise(): Promise<R> {
    return this.#promise
  }

  /**
   * Resolves root promise.
   *
   * @param result - Any typed result.
   *
   * @public
   */
  public resolve(result: R): void {
    this.#onResolve(result)
  }

  /**
   * Rejects root promise.
   *
   * @param reason - Any string message or error instance.
   *
   * @public
   */
  public reject(reason: string | Error | unknown): void {
    this.#onReject(reason)
  }

  /**
   * Alias to await root promise.
   *
   * @public
   */
  public async untilResolved(): Promise<R> {
    return await this.#promise
  }

  /**
   * Checks root promise state.
   *
   * @public
   */
  public isComplete(): boolean {
    return this.#isComplete
  }

  /**
   * Handles resolve process.
   *
   * @param result - Incoming result.
   *
   * @internal
   */
  #onResolve(result: R): void {
    this.#isComplete = true
    this.#signal?.removeEventListener("abort", this.#onReject.bind(this))
    this.#resolve?.(result)
  }

  /**
   * Handles reject process.
   *
   * @param reason - Message, error, or abort event.
   *
   * @internal
   */
  #onReject(reason: string | Error | Event | unknown): void {
    this.#isComplete = true
    this.#signal?.removeEventListener("abort", this.#onReject.bind(this))
    this.#reject?.(reason)
  }
}
