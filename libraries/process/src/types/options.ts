import type {
  ExecOptions as NodeExecOptions,
  ForkOptions as NodeForkOptions,
  SpawnOptions as NodeSpawnOptions,
  StdioOptions
} from "node:child_process"

import type { PROCESS_ERROR_EVENT, PROCESS_MESSAGE_EVENT } from "./events"
import type { Serializable } from "./vendor"

export interface ForkOptions extends NodeForkOptions {
  errors?: boolean
}

export interface SpawnOptions extends NodeSpawnOptions {
  errors?: boolean
}

export interface ExecOptions extends NodeExecOptions {
  errors?: boolean
  stdio?: StdioOptions | undefined
}

export type IOFunction = (data: Serializable) => void

export interface IOHooks {
  [PROCESS_MESSAGE_EVENT]?: IOFunction
  [PROCESS_ERROR_EVENT]?: IOFunction
}

export type Options = ExecOptions | SpawnOptions | ForkOptions
