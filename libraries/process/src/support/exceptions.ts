import type { ExecException } from "node:child_process"

import type { Options, ProcessConfig } from "../types"

export const isProcessError = (error: unknown): error is ExecException =>
  typeof error === "object" && !!error && Object.keys(error).includes("cmd")

export class ProcessExecutionError extends Error {
  public readonly command: string

  public constructor(command: string, stderr?: string) {
    super(`Encountered an error executing child process ${command}: ${stderr}`)
    this.command = command
  }
}

export class ProcessSpawnError extends Error {
  public readonly command: string

  public constructor(command: string, stderr?: string) {
    super(`Encountered an error spawning child process ${command}: ${stderr}`)
    this.command = command
  }
}

export class ProcessTerminationError extends Error {
  public readonly command: string | undefined
  public readonly error: Error

  public constructor(command: string | undefined, error: Error) {
    super(
      `Encountered an error killing child process ${command}: ${error.message}`,
      { cause: error }
    )
    this.command = command
    this.error = error
  }
}

export class ProcessConfigurationError extends Error {
  public readonly config: Partial<ProcessConfig<Options>>

  public constructor(config: Partial<ProcessConfig<Options>>, error: Error) {
    super(
      `Encountered an error while configuring child process: ${JSON.stringify(
        config
      )}`,
      {
        cause: error
      }
    )
    this.config = config
  }
}
