import { configure, nodeSpawn } from "../support"
import { SPAWN } from "../types"
import { manage } from "./manage"
import type {
  ChildProcess,
  ExecutionMethod,
  ProcessConfig,
  SpawnOptions
} from "../types"

/**
 * Spawns an observable child process and awaits a ready state.
 *
 * @remarks
 * Optionally attaches hooks to any valid child process event.
 * Automatically injects process.env into env options.
 * Forked processes "inherit" stdio rather than "pipe" as default.
 * Environment variables from current process are injected through to child process.
 *
 * @public
 */
export const spawn = async (
  command: string,
  args: string[] = [],
  options: SpawnOptions = {}
): Promise<ChildProcess> => {
  // Configure args and options.
  const config: ProcessConfig<SpawnOptions> = configure({ args, options })
  const method: ExecutionMethod = SPAWN
  const filters: string[] = options.filters ?? []

  // Spawn a new child process.
  const childProcess: ChildProcess = manage(
    nodeSpawn(command, config.args, config.options),
    {
      command,
      method,
      filters
    }
  )

  // Await completed spawn event.
  await childProcess.untilOpen()

  return childProcess
}
