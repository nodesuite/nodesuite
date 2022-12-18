/**
 * Throws when registry attempts to lock an existing id.
 *
 * @public
 */
export class IdConflictError extends Error {
  public readonly id: string

  public constructor(id: string) {
    super(`Attempted to lock id "${id}",  but this id was already locked.`)
    this.id = id
  }
}

/**
 * Throws when an item awaiter times out before registration.
 *
 * @public
 */
export class AwaitedTimeoutError extends Error {
  public constructor(timeout: number) {
    super(`Timed out after "${timeout}" waiting for registry item.`)
  }
}

/**
 * Throws when an item awaiter is aborted before registration.
 *
 * @public
 */
export class AwaitedAbortError extends Error {
  public constructor() {
    super(`Aborted await listener before registration.`)
  }
}
