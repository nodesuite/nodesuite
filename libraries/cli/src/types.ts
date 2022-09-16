import type { PerformanceTimer } from "@nodesuite/timer"

export type Os = "Windows" | "macOS" | "Linux" | "Android"

/**
 * Generic command interface.
 *
 * @public
 */
export interface CliCommand {
  readonly name: string
  readonly timer: PerformanceTimer
  readonly os: Os

  run(): Promise<void>

  report(action?: string): void
}

export interface Logger {
  debug(...args: unknown[]): unknown
  info(...args: unknown[]): unknown
  warn(...args: unknown[]): unknown
  error(...args: unknown[]): unknown
  fatal(...args: unknown[]): unknown
}

export interface CliOptions {
  logger?: Logger
}

export type Env<K extends string = string> = Record<K, string | undefined>
