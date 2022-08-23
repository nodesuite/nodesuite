import { configure, nodeSpawn } from "../support"
import { SPAWN } from "../types"
import { manage } from "./manage"
import type {
  ExecutionMethod,
  ManagedProcess,
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
): Promise<ManagedProcess> => {
  // Configure args and options.
  const config: ProcessConfig<SpawnOptions> = configure({ args, options })
  const method: ExecutionMethod = SPAWN

  // Spawn a new child process.
  const managedProcess: ManagedProcess = manage(
    nodeSpawn(command, config.args, config.options),
    {
      command,
      method
    }
  )

  // Await completed spawn event.
  await managedProcess.untilOpen()

  return managedProcess
}
