/**
 * @public
 */
export const [EXEC, SPAWN, FORK, KILL] = [
  "exec",
  "spawn",
  "fork",
  "kill"
] as const

/**
 * @public
 */
export const executionMethods = [EXEC, SPAWN, FORK, KILL] as const

/**
 * @public
 */
export type ExecutionMethod = typeof executionMethods[number]
