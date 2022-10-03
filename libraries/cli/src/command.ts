import "dotenv-defaults/config"

import { useTimer } from "@nodesuite/timer"
import type { PerformanceTimer } from "@nodesuite/timer"

import { getOs } from "./support"
import type { CliCommand, Env, OperatingSystem } from "./types"

/**
 * Abstract CLI Command
 *
 * @remarks
 * Each command should extend this base class, rather than use it directly.
 *
 * @public
 */
export abstract class Command implements CliCommand {
  /**
   * Name of the command for logging.
   *
   * @public
   */
  public abstract readonly name: string

  /**
   * Monitor execution time.
   *
   * @remarks
   * Starts immediately at construction.
   *
   * @public
   */
  public readonly timer: PerformanceTimer = useTimer()

  /**
   * Environment variables loaded from any `.env` or `.env-defaults` files.
   *
   * @see https://github.com/mrsteele/dotenv-defaults
   *
   * @internal
   */
  protected readonly _env: Env = process.env

  /**
   * Resolve the underlying operating system name.
   *
   * @public
   */
  public readonly os: OperatingSystem = getOs()

  /**
   * Primary run command to extend.
   *
   * @virtual
   * @public
   */
  public abstract run(): Promise<void>
}
