import type {
  ExecOptions as NodeExecOptions,
  ForkOptions as NodeForkOptions,
  SpawnOptions as NodeSpawnOptions,
  StdioOptions
} from "node:child_process"

import type { PROCESS_ERROR_EVENT, PROCESS_MESSAGE_EVENT } from "./events"
import type { Serializable } from "./vendor"

interface BaseOptions {
  errors?: boolean
  filters?: string[]
  stdio?: StdioOptions
}

export type ForkOptions = NodeForkOptions & BaseOptions

export type SpawnOptions = NodeSpawnOptions & BaseOptions

export type ExecOptions = NodeExecOptions & BaseOptions

export type IOFunction = (data: Serializable) => void

export interface IOHooks {
  [PROCESS_MESSAGE_EVENT]?: IOFunction
  [PROCESS_ERROR_EVENT]?: IOFunction
}

export type Options = ExecOptions | SpawnOptions | ForkOptions
