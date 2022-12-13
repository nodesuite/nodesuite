import type {
  AbortListener,
  AbortManager,
  AbortOptions,
  AbortResult
} from "./types"

/**
 * Abort Manager
 *
 * @remarks
 * Simplifies interaction with native AbortController instances.
 *
 * @public
 */
export class Abort implements AbortManager {
  /**
   * Internal abort controller instance.
   *
   * @internal
   */
  readonly #abort: AbortController = new AbortController()

  /**
   * Configuration options provided at construction.
   *
   * @internal
   */
  readonly #options: AbortOptions

  /**
   * Constructor
   *
   * @param options - Any configuration options.
   *
   * @public
   */
  public constructor(options: AbortOptions = {}) {
    this.#options = options
  }

  /**
   * Exposes internal abort signal.
   *
   * @public
   */
  public get signal(): AbortSignal {
    return this.#abort.signal
  }

  /**
   * Tests if abort signal has already been triggered.
   *
   * @public
   */
  public isAborted(): boolean {
    return this.#abort.signal.aborted
  }

  /**
   * Triggers abort signal to all attached listeners.
   *
   * @remarks
   * Provides feedback and catches errors.
   *
   * If abort has been previously called, it will not re-trigger and will
   * return a `false` value for "aborted".
   *
   * If the abort process throws an error, it will be returned inline unless
   * configured at construction to throw.
   *
   * @public
   */
  public abort(): AbortResult {
    try {
      if (!this.isAborted()) {
        this.#abort.abort()
        return { aborted: true }
      } else {
        return { aborted: false }
      }
    } catch (error) {
      if (this.#options.throwErrors) {
        throw error
      } else {
        return { aborted: false, error }
      }
    }
  }

  /**
   * Attaches a one-time event listener on abort signal.
   *
   * @param listener - Abort listener hook.
   *
   * @public
   */
  public once(listener: AbortListener): this {
    this.#abort.signal.addEventListener("abort", listener, { once: true })
    return this
  }

  /**
   * Removes a previously attached listener.
   *
   * @param listener - Abort listener hook.
   *
   * @public
   */
  public off(listener: AbortListener): this {
    this.#abort.signal.removeEventListener("abort", listener)
    return this
  }

  /**
   * Ergonomic naming for attaching "once" listener.
   *
   * @param listener - Abort listener hook.
   *
   * @public
   */
  public onAbort(listener: AbortListener): void {
    this.once(listener)
  }
}
