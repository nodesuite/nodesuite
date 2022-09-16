import type {
  ExecOptions as NodeExecOptions,
  ForkOptions as NodeForkOptions,
  SpawnOptions as NodeSpawnOptions
} from "node:child_process"

import type { PROCESS_ERROR_EVENT, PROCESS_MESSAGE_EVENT } from "./events"
import type { Serializable } from "./vendor"

export type ForkOptions = NodeForkOptions & { errors?: boolean }

export type SpawnOptions = NodeSpawnOptions & { errors?: boolean }

export type ExecOptions = NodeExecOptions & { errors?: boolean }

export type IOFunction = (data: Serializable) => void

export interface IOHooks {
  [PROCESS_MESSAGE_EVENT]?: IOFunction
  [PROCESS_ERROR_EVENT]?: IOFunction
}

export type Options = ExecOptions | SpawnOptions | ForkOptions
