import { exec, spawn } from "node:child_process"
import { EventEmitter } from "node:events"
import { resolve } from "node:path"
import { setTimeout } from "node:timers/promises"
import { promisify } from "node:util"
import type { ChildProcess, ExecOptions } from "node:child_process"

import { DEFAULT_TIMEOUT } from "./constants"
import { ContainerTimeoutError, UndefinedPortError } from "./exceptions"
import { debug, extractPorts } from "./support"
import {
  CLOSE_EVENT,
  CLOSING_STATE,
  ERROR_EVENT,
  INITIAL_STATE,
  LAUNCH_EVENT,
  LAUNCHED_STATE,
  LAUNCHING_STATE,
  MESSAGE_EVENT
} from "./types"
import type {
  Container,
  ContainerOptions,
  ContainerReadyState,
  ExecResult
} from "./types"

/**
 * Manages a named container as child process.
 *
 * @public
 */
export class ManagedContainer<O extends ContainerOptions = ContainerOptions>
  extends EventEmitter
  implements Container
{
  /**
   * Container configuration.
   *
   * @internal
   */
  readonly #options: O

  /**
   * Tracks the long-running child process.
   *
   * @internal
   */
  #process: ChildProcess | undefined = undefined

  /**
   * Determines ready state of container.
   *
   * @internal
   */
  #readyState: ContainerReadyState = INITIAL_STATE

  /**
   * All final fully resolved ports.
   *
   * @internal
   */
  #ports: [number, number][] | undefined = undefined

  /**
   * Constructor
   *
   * @public
   */
  public constructor(options: O) {
    super()
    this.#options = options
  }

  /**
   * Exposes unique container name.
   *
   * @public
   */
  public get name(): string {
    return this.#options.name
  }

  /**
   * Attempt to expose final resolved port pairs.
   *
   * @remarks
   * Throws if resolution has not completed.
   *
   * @public
   */
  public get ports(): [number, number][] {
    if (this.#ports) {
      return this.#ports
    }

    throw new UndefinedPortError()
  }

  /**
   * Exposes child process.
   *
   * @public
   */
  public get process(): ChildProcess | undefined {
    return this.#process
  }

  /**
   * Tests if the named container is currently running.
   *
   * @public
   */
  public async isRunning(): Promise<boolean> {
    try {
      const result: ExecResult = await this.#exec(`docker`, [
        `inspect`,
        `-f`,
        `"{{.State.Running}}"`,
        `"${this.name}"`
      ])
      const error: string | undefined = this.#parseErrors(result)
      if (error && !error.includes("No such")) {
        debug(error)
        return false
      } else {
        return true
      }
    } catch (error) {
      this.#onError(error)
      return false
    }
  }

  /**
   * Tests if the named container is listening on expected port.
   *
   * @param portOrUrl - Port or url to test.
   * @param timeout - Max duration in ms to wait for container.
   *
   * @public
   */
  public async isListening(
    portOrUrl: number | URL,
    timeout?: number
  ): Promise<boolean> {
    const isRunning: boolean = await this.isRunning()
    if (!isRunning) {
      return false
    }

    try {
      return await this.waitForServer(portOrUrl, timeout)
    } catch (error) {
      debug(error)
      this.#onError(error)
      return false
    }
  }

  /**
   * Starts a new container instance.
   *
   * @public
   */
  public async run(): Promise<void> {
    // Only attempt to spawn if no existing child process set.
    if (this.#readyState === INITIAL_STATE) {
      await this.#spawn()
    }
  }

  /**
   * Attempts to kill the named container.
   *
   * @public
   */
  public async kill(): Promise<boolean> {
    try {
      if (this.#process) {
        this.#process.kill("SIGTERM")
      }

      const result: ExecResult = await this.#exec(`docker`, [`kill`, this.name])
      const error: string | undefined = this.#parseErrors(result)
      if (
        error &&
        ![`No such`, `Cannot kill`].some((partial) => error.includes(partial))
      ) {
        debug(error)
        return false
      } else {
        return true
      }
    } catch (error) {
      this.#onError(error)
      return false
    } finally {
      this.#onClose()
    }
  }

  /**
   * Waits until container responds or timeout occurs.
   *
   * @remarks
   * Will throw on a timeout event.
   *
   * @param portOrUrl - Port or url to await.
   * @param timeout - Max duration in ms to wait for container.
   *
   * @public
   */
  public async waitForServer(
    portOrUrl: number | URL,
    timeout: number = DEFAULT_TIMEOUT
  ): Promise<boolean> {
    if (!portOrUrl) {
      throw new UndefinedPortError()
    }

    // 1. Race a timeout.
    const abort = async (): Promise<boolean> => setTimeout(timeout, false)

    // 2. Poll remote endpoint.
    const ping = async (): Promise<boolean> => {
      const url: URL =
        portOrUrl instanceof URL
          ? portOrUrl
          : new URL(`http://127.0.0.1:${portOrUrl}`)
      const limit: number = Date.now() + timeout
      let attempt: number = 0
      while (limit > attempt) {
        try {
          const { status } = await fetch(url.href, {
            method: "GET"
          })
          if (status === 200) {
            this.emit("listening")
            debug("Container listening.")
            return true
          }
        } catch (error) {
          // Ignore errors until timeout.
        }
        attempt++
        debug(`No response at ${url}, retrying...`)
        await setTimeout(100 * (attempt / 2))
      }

      throw new ContainerTimeoutError(portOrUrl)
    }

    return await Promise.race([ping(), abort()])
  }

  /**
   * Starts a new container child process.
   *
   * @remarks
   * Important: Only attempt to spawn if no existing child process set.
   *
   * @internal
   */
  async #spawn(): Promise<void> {
    // Only spawn once.
    if (this.#readyState >= LAUNCHING_STATE) {
      return
    }
    this.#readyState = LAUNCHING_STATE

    // Kill any existing container with matching id.
    if (await this.isRunning()) {
      await this.kill()
    }

    // Ensure all requested local ports are available.
    if (this.#options.ports) {
      this.#ports = await Promise.all(this.#options.ports.map(extractPorts))
    }

    const args: string[] = this.#args()
    this.#onMessage(`Starting container. ${JSON.stringify(args)}`)
    this.#process = spawn(`docker run`, args, {
      env: process.env,
      stdio: "pipe",
      shell: true
    })

    this.#registerListeners(this.#process)

    await new Promise<void>((resolve, reject) => {
      if (!this.#process) {
        reject(`No container process registered.`)
      }
      this.#process?.once("spawn", resolve)
      this.#process?.once("exit", () =>
        reject(`Container "${this.name}" exited prematurely.`)
      )
    })

    // Set and emit ready state.
    this.#onReady()
  }

  /**
   * Resolves an array of docker-run command line arguments to append to
   * spawn command.
   *
   * @remarks
   * Performs a filter as final step to remove any empty elements.
   *
   * @internal
   */
  #args(): string[] {
    debug("Generating container command line arguments.")

    const {
      command,
      cwd = process.cwd() ?? __dirname ?? ".",
      entrypoint,
      env = {},
      image,
      name,
      tag,
      user,
      volumes = []
    } = this.#options

    // Resolve from monorepo root or cwd. To bypass, prefix path with "/".
    const external = (path: string): string => resolve(cwd, path)

    // Resolve from container user home directory.
    const internal = (path: string): string => resolve(`/home/${user}`, path)

    const args: string[] = [
      `--rm`,
      `--tty`,
      `--pull=always`,
      `--privileged`,
      `--name "${name}"`,
      `--user "${user}"`,
      `--entrypoint "${internal(entrypoint)}"`
    ]

    // 1. Add ports.
    if (this.#ports) {
      args.push(
        ...this.#ports.map(
          ([externalPort, internalPort]) => `-p ${externalPort}:${internalPort}`
        )
      )
    }

    // 2. Add environment variables.
    args.push(
      ...Object.entries(env)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `-e '${key.trim().toUpperCase()}="${value}"'`)
    )

    // 3. Add volumes.
    args.push(
      ...volumes.map(
        ([externalPath, internalPath]) =>
          `-v "${external(externalPath)}:${internal(internalPath)}"`
      )
    )

    // 4. Final commands.
    args.push(`${image}:${tag}`, internal(command))

    debug(`Generated container arguments: ${args.join(" ")}`)

    return args.filter((arg) => !!arg)
  }

  /**
   * Safely executes a native Node `exec` command.
   *
   * @param cmd - Primary command name and path.
   * @param args - Optional arguments array.
   * @param options - Optional Node `exec` options object.
   *
   * @internal
   */
  async #exec(
    cmd: string,
    args: string[] = [],
    options: ExecOptions = {}
  ): Promise<ExecResult> {
    try {
      const command: string = [cmd, ...args].map((arg) => arg.trim()).join(" ")
      debug(`Executing command: ${command}`)
      return await promisify(exec)(command, options)
    } catch (error) {
      return {
        stderr: error.toString()
      }
    }
  }

  /**
   * Determines if an `exec` result contains errors.
   *
   * @param result - Node `exec` result object.
   *
   * @internal
   */
  #parseErrors({ stdout, stderr }: ExecResult): string | undefined {
    if (stderr) {
      return stderr
    }
    if (stdout?.includes(`Error`)) {
      return stdout
    }

    return undefined
  }

  /**
   * Registers key event listeners to a child process.
   *
   * @param childProcess - Spawned child process.
   *
   * @internal
   */
  #registerListeners(childProcess: ChildProcess): void {
    debug("Attaching container listeners.")
    childProcess.once("error", this.#onError.bind(this))
    childProcess.once("kill", this.#onClose.bind(this))
    childProcess.stdout?.on("data", this.#onMessage.bind(this))
    childProcess.stderr?.on("data", this.#onMessage.bind(this))
    process.once("SIGTERM", this.kill.bind(this))
  }

  /**
   * Handles ready state.
   *
   * @internal
   */

  #onReady(): void {
    this.#readyState = LAUNCHED_STATE
    this.emit(LAUNCH_EVENT)
    debug(`Container ready.`)
  }

  /**
   * Emits stdio and other messages from container.
   *
   * @param data - Any data to emit.
   *
   * @internal
   */
  #onMessage(data: Buffer | string): void {
    const message: string = data.toString("utf-8").trim()
    this.emit(MESSAGE_EVENT, message)

    // Handle debug output.
    const maxLength: number = 1000
    if (message.length > maxLength) {
      debug(`${message.slice(0, maxLength)}...`)
    } else {
      debug(message)
    }
  }

  /**
   * Runs cleanup process on close events.
   *
   * @internal
   */
  #onClose(): void {
    debug(`Closing container "${this.name}".`)
    if (this.#readyState >= CLOSING_STATE) {
      return
    }

    this.#readyState = CLOSING_STATE

    if (this.#process) {
      // Tear down child process cleanly.
      const clean = (): void => {
        this.#process?.removeAllListeners()
        this.#process?.stdout?.removeAllListeners()
        this.#process?.stderr?.removeAllListeners()
        this.#process?.unref()
        this.emit(CLOSE_EVENT)
      }

      // Perform cleanup only when killed.
      if (this.#process.killed) {
        clean()
      } else {
        this.kill().catch(this.#onError.bind(this))
        this.#process.once("kill", clean)
      }
    }
  }

  /**
   * Handles any internal errors.
   *
   * @param error - Error instance or string.
   *
   * @internal
   */
  #onError(error: Error | string): void {
    this.emit(ERROR_EVENT, typeof error === "string" ? new Error(error) : error)
  }
}
