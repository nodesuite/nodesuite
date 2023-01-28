import type { Options, ProcessConfig } from "../types"

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
    this.name = "ProcessConfigurationError"
    this.config = config
  }
}
