import "dotenv-defaults/config"

import { useTimer } from "@nodesuite/timer"
import type { PerformanceTimer } from "@nodesuite/timer"

import { fallbackLogger, getOs } from "./support"
import type { CliCommand, CliOptions, Env, Logger, Os } from "./types"

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
   * Typed environment variables pre-parsed by `dotenv-defaults`.
   *
   * @see https://github.com/mrsteele/dotenv-defaults
   *
   * @internal
   */
  protected readonly _env: Env = process.env

  /**
   * Logging instance passed in at construction.
   *
   * @remarks
   * If no logging instance is provided, a fallback logger using `console` methods is used.
   *
   * @public
   */
  public readonly logger: Logger

  /**
   * Resolve the underlying operating system name.
   *
   * @public
   */
  public readonly os: Os = getOs()

  /**
   * Constructor
   *
   * @param options - CLI configuration options object.
   *
   * @public
   */
  protected constructor({ logger }: CliOptions = {}) {
    this.logger = logger ?? fallbackLogger
  }

  /**
   * Primary run command to extend.
   *
   * @virtual
   * @public
   */
  public abstract run(): Promise<void>

  /**
   * Reports the performance timer duration to console and stops the timer.
   *
   * @param action - Description of the action to report duration for.
   *
   * @public
   */
  public report(action: string = "executed"): void {
    this.logger.info(
      `Command "${this.name}" ${action} in ${this.timer.getDuration()} ms.`
    )
  }
}
