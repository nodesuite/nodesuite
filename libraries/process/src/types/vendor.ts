import type Node from "node:child_process"

import type { STDERR, STDOUT } from "./stdio"

export type NodeChildProcess = Node.ChildProcess

export type NodeExecOptions = Node.ExecOptions
export type NodeSpawnOptions = Node.SpawnOptions
export type NodeForkOptions = Node.ForkOptions
export type NodeStdioOptions = Node.StdioOptions

export type Serializable = string | object | number | boolean | bigint

/**
 * String output from child process execution.
 *
 * @public
 */
export interface ProcessResult {
  [STDOUT]?: string
  [STDERR]?: string
}

/**
 * Common process.env values.
 *
 * @public
 */
export interface ProcessEnv {
  TZ?: string
  NODE_ENV?: "development" | "test" | "production"

  [key: string]: string | undefined
}

/**
 * NodeJS "exec" command.
 *
 * @public
 */
export type NodeExec = (
  command: string,
  options: NodeExecOptions
) => Promise<ProcessResult>

/**
 * NodeJS "spawn" command.
 *
 * @public
 */
export type NodeSpawn = (
  command: string,
  args: ReadonlyArray<string>,
  options: NodeSpawnOptions
) => NodeChildProcess

/**
 * NodeJS "fork" command.
 *
 * @public
 */
export type NodeFork = (
  command: string,
  args: ReadonlyArray<string>,
  options: NodeForkOptions
) => NodeChildProcess

/**
 * Type guard to determine if a value is a valid process error.
 *
 * @param error - Possible error value to test.
 *
 * @public
 */
export const isProcessError = (error: unknown): error is Node.ExecException =>
  typeof error === "object" && !!error && Object.keys(error).includes("cmd")
