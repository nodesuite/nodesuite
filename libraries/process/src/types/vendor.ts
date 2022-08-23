import type Node from "node:child_process"

import type { STDERR, STDOUT } from "./stdio"

export type NodeChildProcess = Node.ChildProcess

export type NodeExecOptions = Node.ExecOptions
export type NodeSpawnOptions = Node.SpawnOptions
export type NodeForkOptions = Node.ForkOptions
export type NodeStdioOptions = Node.StdioOptions

export type Serializable = string | object | number | boolean | bigint

export interface ProcessResult {
  [STDOUT]?: string
  [STDERR]?: string
}

export interface ProcessEnv {
  TZ?: string

  [key: string]: string | undefined
}

export type NodeExec = (
  command: string,
  options: NodeExecOptions
) => Promise<ProcessResult>

export type NodeSpawn = (
  command: string,
  args: ReadonlyArray<string>,
  options: NodeSpawnOptions
) => NodeChildProcess

export type NodeFork = (
  command: string,
  args: ReadonlyArray<string>,
  options: NodeForkOptions
) => NodeChildProcess
