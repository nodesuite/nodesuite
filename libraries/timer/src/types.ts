export interface PerformanceTimer {
  readonly startedAt: Date
  readonly stoppedAt: Date | undefined

  restart(): this

  stop(): this

  isRunning(): boolean

  isStopped(): boolean

  getDuration(): number
}
