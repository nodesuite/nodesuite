import type { PerformanceTimer } from "./types"

/**
 * Simple timer utility for use within long-running modules.
 *
 * @public
 */
export class Timer implements PerformanceTimer {
  /**
   * Timestamp of when the timer was instantiated.
   *
   * @internal
   */
  private _startedAt: number = Date.now()

  /**
   * Timestamp of when the timer was stopped.
   *
   * @internal
   */
  private _stoppedAt: number | undefined

  /**
   * Resets and restarts the timer.
   *
   * @public
   */
  public restart(): this {
    this._startedAt = Date.now()
    this._stoppedAt = undefined
    return this
  }

  /**
   * Stops the timer.
   */
  public stop(): this {
    this._stoppedAt = Date.now()
    return this
  }

  /**
   * Presents a date object for started timestamp.
   *
   * @public
   */
  public get startedAt(): Date {
    return new Date(this._startedAt)
  }

  /**
   * Presents a date object for stopped timestamp.
   *
   * @public
   */
  public get stoppedAt(): Date | undefined {
    return this._stoppedAt ? new Date(this._stoppedAt) : undefined
  }

  /**
   * Calculate the duration of the timer.
   *
   * @public
   */
  public getDuration(): number {
    return this._stoppedAt
      ? this._stoppedAt - this._startedAt
      : Date.now() - this._startedAt
  }

  /**
   * Checks if the timer is still running.
   *
   * @public
   */
  public isRunning(): boolean {
    return this._stoppedAt === undefined
  }

  /**
   * Checks if timer was running but is now stopped.
   *
   * @public
   */
  public isStopped(): boolean {
    return !!this._stoppedAt
  }
}
