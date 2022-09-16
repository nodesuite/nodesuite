export class ProcessExecutionError extends Error {
  public readonly command: string

  public constructor(command: string, stderr?: string) {
    super(`Encountered an error executing child process ${command}: ${stderr}`)
    this.command = command
  }
}
