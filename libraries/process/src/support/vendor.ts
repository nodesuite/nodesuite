import { exec, fork, spawn } from "node:child_process"
import { promisify } from "node:util"

import type { NodeExec, NodeFork, NodeSpawn } from "../types"

/**
 * Promisified Node exec method.
 *
 * @internal
 */
export const nodeExec: NodeExec = promisify(exec)

/**
 * Original node spawn method.
 *
 * @internal
 */
export const nodeSpawn: NodeSpawn = spawn

/**
 * Original node fork method.
 *
 * @internal
 */
export const nodeFork: NodeFork = fork
