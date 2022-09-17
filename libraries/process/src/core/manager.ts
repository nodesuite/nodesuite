import EventEmitter from "node:events"
import { defer } from "@nodesuite/defer"
import type { Deferral } from "@nodesuite/defer"

import { ProcessNotAvailableError } from "../errors"
import { PROCESS_CLOSE_EVENT, PROCESS_OPEN_EVENT } from "../types"
import type { ChildProcess } from "../types"

/**
 * Abstract utility wrapper for building process-based classes.
 *
 * @remarks
 * Inheritors should implement own "open" and "close" logic which is provided to
 * the "setOpen" and "setClose" handlers.
 *
 * Importantly, to release the opener and closer promises, the "open" and "close"
 * logic should emit the appropriate process event to signal ready state.
 *
 * @public
 */
export abstract class ProcessManager extends EventEmitter {
  /**
   * Static reference to the intended executable path.
   *
   * @internal
   */
  protected _command: string | undefined

  /**
   * Internal child process.
   *
   * @internal
   */
  protected _process: ChildProcess | undefined

  /**
   * Deferred promise to present if opening process has already begun.
   *
   * @internal
   */
  readonly #opener: Deferral = defer()

  /**
   * Deferred promise to present if closing process has already begun.
   *
   * @internal
   */
  readonly #closer: Deferral = defer()

  /**
   * Flag to avoid multiple open.
   *
   * @internal
   */
  #isOpening: boolean = false

  /**
   * Flag to avoid multiple closes.
   *
   * @internal
   */
  #isClosing: boolean = false

  /**
   * Access the executable path of the underlying child process.
   *
   * @public
   */
  public get command(): string | undefined {
    return this._command
  }

  /**
   * The process id of the internal child process.
   *
   * @public
   */
  public get pid(): number | undefined {
    return this.process().pid
  }

  /**
   * Expose the internal child process and assert ready state.
   *
   * @public
   */
  public process(): ChildProcess {
    if (!this._process) {
      throw new ProcessNotAvailableError(this.command)
    }
    return this._process
  }

  /**
   * Awaits the deferred close event.
   *
   * @public
   */
  public untilClose(): Promise<void> {
    return this.#closer.untilResolved()
  }

  /**
   * Returns an existing open or sets an opening state.
   *
   * @remarks
   * This is used to stack duplicate open calls into the single promise.
   *
   * @internal
   */
  protected _setOpen(open: () => Promise<void>): Promise<void> | undefined {
    if (this.#isOpening) {
      return this.#opener.promise
    } else {
      this.once(PROCESS_OPEN_EVENT, () => this.#opener.resolve())
      return open()
    }
  }

  /**
   * Returns an existing close or sets a closing state.
   *
   * @remarks
   * This is used to stack duplicate close calls into the single promise.
   *
   * @internal
   */
  protected _setClose(close: () => Promise<void>): Promise<void> | undefined {
    if (this.#isClosing) {
      return this.#closer.promise
    } else {
      this.once(PROCESS_CLOSE_EVENT, () => this.#closer.resolve())
      return close()
    }
  }

  /**
   * Completes the opening process if started.
   *
   * @internal
   */
  protected _completeOpen(): void {
    if (this._process) {
      this.emit(PROCESS_OPEN_EVENT)
      this.#opener.resolve()
    } else {
      throw new ProcessNotAvailableError(this.command)
    }
  }

  /**
   * Completes the closing process if started.
   *
   * @internal
   */
  protected _completeClose(): void {
    if (this._process) {
      this._process.timer.stop()
      this.emit(PROCESS_CLOSE_EVENT)
      this.#closer.resolve()
      this._process.removeAllListeners()
      this.removeAllListeners()
    } else {
      throw new ProcessNotAvailableError(this.command)
    }
  }
}
