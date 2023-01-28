export class ProcessNotAvailableError extends Error {
  public readonly command: string

  public constructor(command: string = "at unspecified executable path") {
    super(`Encountered an error spawning child process ${command}.`)
    this.name = "ProcessNotAvailableError"
    this.command = command
  }
}
