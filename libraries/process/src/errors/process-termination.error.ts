export class ProcessTerminationError extends Error {
  public readonly command: string | undefined
  public readonly error: Error

  public constructor(command: string | undefined, error: Error) {
    super(
      `Encountered an error killing child process ${command}: ${error.message}`,
      { cause: error }
    )
    this.name = "ProcessTerminationError"
    this.command = command
    this.error = error
  }
}
