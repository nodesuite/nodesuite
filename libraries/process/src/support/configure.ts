import { ProcessConfigurationError } from "../errors"
import type {
  ExecOptions,
  ForkOptions,
  ProcessConfig,
  ProcessEnv,
  SpawnOptions
} from "../types"

/**
 * Prepares child process arguments and options prior to execution.
 *
 * @param config - User input as configuration object.
 *
 * @internal
 */
export const configure = <O extends SpawnOptions | ForkOptions | ExecOptions>(
  config: ProcessConfig<O>
): ProcessConfig<O> => {
  try {
    // Strips empty elements and trims args array.
    const parseArgs = (command: string = "", args: string[] = []): string[] => [
      ...[command, ...args]
        .map((value: string) => value.trim())
        .filter((value) => !!value)
    ]

    // Merges environment variables from current process with any provided by child process options.
    const mergeEnv = (env: ProcessEnv = {}): ProcessEnv => ({
      ...process.env,
      ...env
    })

    // Merges process options with current environment variables.
    const parseOptions = <O extends SpawnOptions | ForkOptions | ExecOptions>(
      options: O
    ): O => ({
      ...options,
      env: mergeEnv(options.env)
    })

    const args: string[] = parseArgs(config.command, config.args)
    const options: O = parseOptions(config.options)

    return {
      args,
      options
    }
  } catch (error) {
    throw new ProcessConfigurationError(config, error as Error)
  }
}
