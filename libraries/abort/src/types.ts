/**
 * Abort listener hook.
 *
 * @public
 */
export type AbortListener<R = unknown> = (event?: Event) => R

/**
 * Simplified AbortController wrapper.
 *
 * @public
 */
export interface AbortManager {
  /* Exposes internal abort signal. */
  readonly signal: AbortSignal

  /* Tests if abort signal has already been triggered. */
  isAborted(): boolean

  /* Triggers abort signal to all attached listeners. */
  abort(event?: Event): AbortResult

  /* Attach a new one-time event listener. */
  once<R = unknown>(listener: AbortListener<R>): this

  /* Attach a new one-time event listener. */
  onAbort<R = unknown>(listener: AbortListener<R>): void

  /** Removes a previously attached listener. */
  off(listener: AbortListener): this

  /** Removes all listeners but does not trigger abort. */
  clear(): void
}

/**
 * Configuration options for `AbortManager` instances.
 *
 * @public
 */
export interface AbortOptions {
  /** If set to "true", any errors caught during `abort()` will throw. */
  throwErrors?: boolean
}

/**
 * Native `AbortController` error type.
 *
 * @public
 */
export interface AbortError extends Error {
  /** `AbortController` emits a coded error. */
  code: "ABORT_ERR"
}

export interface AbortResult {
  /** If abort has already been triggered, will return false. */
  aborted: boolean
  /** Any error thrown from the abort handler. */
  error?: AbortError | Error
}

/**
 * Tests if an error is an AbortController error instance.
 *
 * @param error - Any error object to test.
 *
 * @public
 */
export const isAbortError = (error: Error | unknown): error is AbortError =>
  error instanceof Error &&
  Object.keys(error).includes("code") &&
  (error.name === "AbortError" || (error as AbortError).code === "ABORT_ERR")
