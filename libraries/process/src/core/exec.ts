import { configure, nodeExec, ProcessExecutionError } from "../support"
import type { ExecOptions, ProcessConfig } from "../types"

/**
 * Provide async child process executor.
 *
 * @remarks
 * Throws error on `stderr` output unless suppressed.
 * If process is long-running, do not await the Promise.
 * Environment variables from current process are injected through to child process.
 *
 * @public
 */
export const exec = async (
  command: string,
  args: string[] = [],
  options: ExecOptions = {}
): Promise<string> => {
  // Configure args and options.
  const config: ProcessConfig<ExecOptions> = configure({
    command,
    args,
    options
  })

  // Await child process execution.
  const { stdout, stderr } = await nodeExec(
    config.args.join(` `),
    config.options
  )

  // Check stderr for any error messages.
  if (stderr) {
    throw new ProcessExecutionError(command, stderr)
  }

  // Return stdout.
  return stdout ?? ""
}
