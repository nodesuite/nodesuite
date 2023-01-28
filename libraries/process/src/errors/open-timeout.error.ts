/**
 * Throws when a child process does not open within given timeout.
 *
 * @public
 */
export class OpenTimeoutError extends Error {
  public readonly command: string | number | undefined
  public readonly timeout: number

  public constructor(command: string | number | undefined, timeout: number) {
    super(
      `Open state listener on child process "${command}" timed out after ${timeout}ms.`
    )
    this.name = "OpenTimeoutError"
    this.command = command
    this.timeout = timeout
  }
}
