import type { PerformanceTimer } from "@nodesuite/timer"

/**
 * Name of operating system the command is running on.
 *
 * @public
 */
export type OperatingSystem = "Windows" | "macOS" | "Linux" | "Android"

/**
 * Generic command interface.
 *
 * @public
 */
export interface CliCommand {
  /**
   * Monitor execution time.
   *
   * @public
   */
  readonly name: string

  /**
   * Logging instance passed in at construction.
   *
   * @public
   */
  readonly timer: PerformanceTimer

  /**
   * Resolve the underlying operating system name.
   *
   * @public
   */
  readonly os: OperatingSystem

  /**
   * Primary run command which starts the application.
   *
   * @public
   */
  run(): Promise<void>
}

/**
 * Typed environment variables.
 *
 * @public
 */
export type Env<K extends string = string> = Record<K, string | undefined>
