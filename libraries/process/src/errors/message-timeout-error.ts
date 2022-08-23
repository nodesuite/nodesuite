export class MessageTimeoutError extends Error {
  public readonly command: string | number | undefined
  public readonly timeout: number

  public constructor(command: string | number | undefined, timeout: number) {
    super(
      `Message listener on child process "${command}" timed out after ${timeout}ms.`
    )
    this.command = command
    this.timeout = timeout
  }
}
