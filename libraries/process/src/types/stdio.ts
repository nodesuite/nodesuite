/**
 * @public
 */
export const [IO_OVERLAPPED, IO_PIPE, IO_IGNORE, IO_INHERIT, IO_IPC] = [
  "overlapped",
  "pipe",
  "ignore",
  "inherit",
  "ipc"
] as const

/**
 * @public
 */
export const ioTypes = [
  IO_OVERLAPPED,
  IO_PIPE,
  IO_IGNORE,
  IO_INHERIT,
  IO_IPC
] as const

/**
 * @public
 */
export type IOType = typeof ioTypes[number]

/**
 * @public
 */
export const [STDIN, STDOUT, STDERR, STDIO] = [
  "stdin",
  "stdout",
  "stderr",
  "stdio"
] as const

/**
 * @public
 */
export const inputTypes = [STDIN]

/**
 * @public
 */
export const outputTypes = [STDOUT, STDERR]

/**
 * @public
 */
export type InputType = typeof inputTypes[number]

/**
 * @public
 */
export type OutputType = typeof outputTypes[number]
