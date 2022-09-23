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

  /**
   * Reports the performance timer duration to console and stops the timer.
   *
   * @param action - Description of the action to report duration for.
   *
   * @public
   */
  report(action?: string): void
}

/**
 * Abstract logger attached to command.
 *
 * @remarks
 * If not logging service is provided to the command at construction, the
 * command will fall back to the closest `console` method.
 *
 * @public
 */
export interface Logger {
  /* Sends "debug" level messages to logger. */
  debug(...args: unknown[]): unknown
  /* Sends "info" level messages to logger. */
  info(...args: unknown[]): unknown
  /* Sends "warn" level messages to logger. */
  warn(...args: unknown[]): unknown
  /* Sends "error" level messages to logger. */
  error(...args: unknown[]): unknown
  /* Sends "fatal" level messages to logger. Should throw error upon call. */
  fatal(...args: unknown[]): unknown
}

/**
 * Any initial options passed to constructor.
 *
 * @public
 */
export interface CommandOptions {
  logger?: Logger
}

/**
 * Typed environment variables.
 *
 * @public
 */
export type Env<K extends string = string> = Record<K, string | undefined>
