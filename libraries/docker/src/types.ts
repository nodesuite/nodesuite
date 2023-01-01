import type { EventfulRegistry } from "@nodesuite/registry"
import type { ChildProcess } from "node:child_process"
import type { EventEmitter } from "node:events"

/**
 * Interface for expected environment variables after `dotenv` has loaded.
 *
 * @public
 */
export interface Env extends Partial<Record<string, string>> {
  NODE_ENV?: string
}

/**
 * Abstract docker container interface.
 *
 * @public
 */
export interface Container extends EventEmitter {
  /** Unique container name. */
  readonly name: string

  /** Final resolved port pairs. Will throw if not resolved. */
  readonly ports: [number, number][]

  readonly process: ChildProcess | undefined

  /** Tests if named container is running. */
  isRunning(): Promise<boolean>

  isListening(portOrUrl: number | URL, timeout?: number): Promise<boolean>

  /** Polls the container on expected port until response. */
  waitForServer(portOrUrl: number | URL, timeout?: number): Promise<boolean>

  /** Starts or awaits container and returns port. */
  run(): Promise<void>

  /** Attempts to kill named container. */
  kill(): Promise<boolean>
}

/**
 * Registry type for containers.
 *
 * @public
 */
export interface Containers<O extends ContainerOptions = ContainerOptions>
  extends EventfulRegistry<Container> {
  /** Default timeout to wait for a pending container. */
  readonly timeout: number

  /** Creates or retrieves a container. */
  create(options: O): Container

  /** Awaits a fully launched container. */
  resolve(options: O): Promise<Container>
}

/**
 * Factory function for creating new custom containers.
 *
 * @public
 */
export type ContainerFactory<O extends ContainerOptions = ContainerOptions> = (
  options: O
) => Container

/**
 * Optional config for custom containers.
 *
 * @public
 */
export interface ContainerRegistryConfig<
  O extends ContainerOptions = ContainerOptions
> {
  /** Custom container factory. Defaults to base container. */
  create?: ContainerFactory<O>

  /** Default timeout to wait for server response. */
  timeout?: number
}

/**
 * Container configuration options.
 *
 * @public
 */
export interface ContainerOptions extends Record<string, unknown> {
  /** Remote container image url. */
  image: string

  /** Unique name for container. Cannot contain special characters. */
  name: string

  /** Linux username to use for login. Example "browser". */
  user: string

  /** Container entrypoint arg. */
  entrypoint: string

  /** Post-entrypoint command to run.  Example "bash". */
  command: string

  /** Version tag. Example "staging". */
  tag?: string

  /** Additional environment variables to pass to container. */
  env?: Partial<Env>

  /** Additional volumes to mount. */
  volumes?: [string, string][]

  /** Current working directory. */
  cwd?: string

  /** Ports to expose. */
  ports?: (number | [number, number] | ContainerPorts)[]
}

/**
 * Complex port definition interface.
 *
 * @public
 */
export interface ContainerPorts {
  /** Local port to connect into container. Can be explicit or random range. */
  external: number | [number, number]
  /** Internal container port to expose. */
  internal: number
}

/**
 * Native Node `exec` result object.
 *
 * @public
 */
export interface ExecResult {
  /** Stringified `stdout` result.  */
  stdout?: string
  /** Stringified `stderr` result. */
  stderr?: string
}

/**
 * All numeric ready states as constants.
 *
 * @public
 */
export const [
  INITIAL_STATE,
  LAUNCHING_STATE,
  LAUNCHED_STATE,
  CLOSING_STATE,
  CLOSED_STATE
] = [0, 1, 2, 3, 4] as const

/**
 * All ready states as array.
 *
 * @public
 */
export const readyStates = [
  INITIAL_STATE,
  LAUNCHING_STATE,
  LAUNCHED_STATE,
  CLOSING_STATE,
  CLOSED_STATE
] as const

/**
 * Container ready state.
 *
 * @remarks
 * Number value between 0 and 4 (five states total).
 * 0 = Initial
 * 1 = Launching
 * 2 = Launched
 * 3 = Closing
 * 4 = Closed
 *
 * Use constants for descriptive string names.
 *
 * @public
 */
export type ContainerReadyState = typeof readyStates[number]

/**
 * All event names emitted by container.
 *
 * @public
 */
export const [LAUNCH_EVENT, MESSAGE_EVENT, CLOSE_EVENT, ERROR_EVENT] = [
  "launch",
  "message",
  "close",
  "error"
] as const

/**
 * All container event names in array.
 *
 * @public
 */
export const containerEvents = [
  LAUNCH_EVENT,
  MESSAGE_EVENT,
  CLOSE_EVENT,
  ERROR_EVENT
] as const

/**
 * Container event name.
 *
 * @remarks
 * List of lifecycle event names emitted by container.
 *
 * @public
 */
export type ContainerEvent = typeof containerEvents[number]
