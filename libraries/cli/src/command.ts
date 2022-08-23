import "dotenv-defaults/config"

import { useTimer } from "@nodesuite/timer"
import type { PerformanceTimer } from "@nodesuite/timer"

import { fallbackLogger, getOs } from "./support"
import type { CliCommand, CliOptions, Logger, Os } from "./types"

/**
 * Base CLI Command
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
   * @remarks
   * This is distinct from the "fake" operating system provided by fingerprint config.
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
   */
  public abstract run(): Promise<void>

  /**
   * Reports the performance timer duration to console and stops the timer.
   *
   * @param action - Description of the action to report duration for.
   */
  public report(action: string = "executed"): void {
    this.logger.info(
      `Command "${this.name}" ${action} in ${this.timer.getDuration()} ms.`
    )
  }
}
