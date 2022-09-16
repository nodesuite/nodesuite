export class ProcessSpawnError extends Error {
  public readonly command: string

  public constructor(command: string, stderr?: string) {
    super(`Encountered an error spawning child process ${command}: ${stderr}`)
    this.command = command
  }
}
