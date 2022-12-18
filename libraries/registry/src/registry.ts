import { EventEmitter } from "node:events"

import {
  AwaitedAbortError,
  AwaitedTimeoutError,
  IdConflictError
} from "./exceptions"
import { anyItem } from "./support"
import { EMPTY_EVENT, isHook, REGISTER_EVENT, UNREGISTER_EVENT } from "./types"
import type {
  EventfulRegistry,
  Filter,
  Id,
  Item,
  LifecycleActions,
  LifecycleEvents,
  RegistryConfig,
  RegistryItems,
  WaitOptions
} from "./types"

/**
 * Abstract component registry.
 *
 * @remarks
 * Handles lifecycle management of eventful components.
 *
 * @public
 */
export abstract class Registry<T extends Item>
  extends EventEmitter
  implements EventfulRegistry<T>
{
  /**
   * Parent abort controller.
   *
   * @remarks
   * Used to trigger a close on parent and listen for aborts.
   *
   * @internal
   */
  readonly #abort: AbortController | undefined

  /**
   * Item lifecycle event names to listen on for key actions.
   *
   * @internal
   */
  readonly #events: LifecycleEvents

  /**
   * Instructions on how to handle key registry lifecycle events.
   *
   * @internal
   */
  readonly #actions: LifecycleActions

  /**
   * All items are registered and de-registered on internal map.
   *
   * @internal
   */
  readonly #items: RegistryItems<T> = new Map()

  /**
   * Constructor
   *
   * @param config - Browser registry configuration object.
   *
   * @public
   */
  protected constructor({
    events = {},
    actions = {},
    abort
  }: RegistryConfig = {}) {
    super()

    this.#events = events
    this.#actions = actions
    this.#abort = abort
  }

  /**
   * Filterable array of all registered items.
   *
   * @remarks
   * This array filters out any items which may have locked an id,
   * but have not fully registered.
   *
   * To query a list of all ids, use `this.ids()`.
   *
   * @param filter - Registered id, filter function, or filter object.
   *
   * @public
   */
  public list(filter: Filter<T> = anyItem): T[] {
    const items: T[] = []
    for (const item of this.#items.values()) {
      if (item && this.#match(item, filter)) {
        items.push(item)
      }
    }
    return items
  }

  /**
   * Reports the number of items registered.
   *
   * @param filter - Registered id, filter function, or filter object.
   *
   * @public
   */
  public count(filter?: Filter<T>): number {
    return this.list(filter).length
  }

  /**
   * Array of all locked ids.
   *
   * @remarks
   * Important: Returns *all* ids, not just those with registered items.
   * This can be useful when determining if a new id is available.
   *
   * To extract a list of only ids with registered items, use `this.list()`.
   *
   * @public
   */
  public ids(): string[] {
    return [...this.#items.keys()]
  }

  /**
   * Tests if an item matching a given id exists.
   *
   * @param id - Launch id to search for.
   *
   * @public
   */
  public has(id: Id): boolean {
    return this.#items.has(id)
  }

  /**
   * Checks if the registry has registered any items.
   *
   * @remarks
   * Useful for checking initial state.
   * Important: Must call the map rather than array to see all pending items.
   *
   * @public
   */
  public hasItems(): boolean {
    return !!this.#items.size
  }

  /**
   * Locks an id to prevent multiple deferred items sharing the same id.
   *
   * @remarks
   * Will throw an error if id is already locked.
   * The "lock" process sets an empty value on the internal map, expecting
   * this to be replaced in the future with a fully registered item.
   *
   * @param id - Valid id to lock.
   *
   * @public
   */
  public lock(id: Id): void {
    if (this.#items.has(id)) {
      throw new IdConflictError(id)
    }
    this.#items.set(id, undefined)
  }

  /**
   * Attempts to find a registered id for a given item match.
   *
   * @param filter - Registered id, filter function, or filter object.
   *
   * @public
   */
  public getId(filter: Filter<T>): Id | undefined {
    const [id] =
      [...this.#items.entries()].find(
        ([, item]) => item && this.#match(item, filter)
      ) ?? []

    return id
  }

  /**
   * Handles registration of a new eventful item.
   *
   * @param id - Unique registry id.
   * @param item - New item instance to register.
   *
   * @public
   */
  public register(id: Id, item: T): void {
    // Update the registry with fully constructed item.
    // Prior to this, the id entry will be empty.
    this.#items.set(id, item)

    // Attach auto-removal listener if provided.
    if (this.#events.unregister) {
      item.once(this.#events.unregister, () => {
        this.unregister(id, item)
        this.emit(UNREGISTER_EVENT, item)
      })
    }

    // If a "ready state" event provided, only emit once complete.
    if (this.#events.register) {
      item.once(this.#events.register, () => {
        this.emit(REGISTER_EVENT, item)
      })
    } else {
      this.emit(REGISTER_EVENT, item)
    }
  }

  /**
   * Handles de-registration of an existing eventful item.
   *
   * @param id - Unique registry id.
   * @param item - Existing item instance to deregister.
   *
   * @public
   */
  public unregister(id: Id, item: T): void {
    this.#items.delete(id)
    this.emit(UNREGISTER_EVENT, item)

    // Execute any user-defined "onEmpty" actions.
    if (!this.count()) {
      this.emit(EMPTY_EVENT)
      if (isHook(this.#actions.onEmpty)) {
        this.#actions.onEmpty(this)
      } else {
        switch (this.#actions.onEmpty) {
          case "abort":
            this.#abort?.abort()
            break
        }
      }
    }
  }

  /**
   * Attempts to find an existing item by filter.
   *
   * @param filter - Registered id, filter function, or filter object.
   *
   * @internal
   */
  public find(filter: Filter<T>): T | undefined {
    return this.list(filter)[0]
  }

  /**
   * Returns the first registered item, or waits for one to be registered.
   *
   * @param options - Optional timeout to wait if item does not yet exist.
   *
   * @public
   */
  public async first({ timeout, signal }: WaitOptions = {}): Promise<T> {
    // Internal abort controller must sync to external signal.
    const abort: AbortController = new AbortController()

    // Ensure listeners are removed to prevent memory leaks.
    const cancel = (): void => {
      abort.abort()
      signal?.removeEventListener("abort", cancel)
    }
    if (signal) {
      signal.addEventListener("abort", cancel, { once: true })
    }

    // Return either any existing browser, or match the next item to emerge.
    return Promise.race([
      new Promise<T>((resolve) => {
        // Return first item if already registered.
        if (this.hasItems()) {
          const item: T | undefined = this.list()[0]
          if (item) {
            cancel()
            resolve(item)
          }
        }
      }),

      // If no items registered, wait for one to register.
      this.waitForNextItem({ timeout, signal: abort.signal })
    ])
  }

  /**
   * Waits for a deferred item matching a given filter.
   *
   * @remarks
   * There situations where an item with a specific locked id
   * may be accessed prior to completed registration.
   * To handle these cases, this method "awaits" a matching item to emerge
   * even if it is not yet registered.
   *
   * @remarks
   * In most cases, the less complex `find()` method is sufficient if a
   * deferral is not required.
   *
   * @param filter - Registered id, filter function, or filter object.
   * @param options - Optional timeout from query string.
   *
   * @public
   */
  public async waitForItem(
    filter: Filter<T>,
    options: WaitOptions = {}
  ): Promise<T> {
    this.emit("wait")
    return this.#waitForItem(filter, options)
  }

  /**
   * Waits for the next item to be registered.
   *
   * @param options - Optional timeout from query string.
   *
   * @public
   */
  public async waitForNextItem(options: WaitOptions = {}): Promise<T> {
    this.emit("wait")
    return this.#waitForItem(anyItem, options)
  }

  /**
   * Resolves the filter type and performs a match against a provided item.
   *
   * @param item - Current item from registry to match.
   * @param filter - Registered id, filter function, or filter object.
   *
   * @internal
   */
  #match(item: T, filter: Filter<T>): boolean {
    if (typeof filter === "string") {
      return this.#items.get(filter) === item
    } else if (typeof filter === "function") {
      return filter(item)
    } else if (filter.value instanceof RegExp) {
      return !!String(item[filter.key]).match(filter.value)
    } else {
      return item[filter.key] === filter.value
    }
  }

  /**
   * Listens to now item registration events and returns the first match
   * based on filter function.
   *
   * @remarks
   * The filter param is defined as a function, as only allowing a
   * `id` was too restrictive. An "array-style" filter function allows
   * finer control over which item should be awaited.
   *
   * @param filter - Registered id, filter function, or filter object.
   * @param options - Options to adjust timeout and early cancellation signal.
   *
   * @internal
   */
  async #waitForItem(
    filter: Filter<T>,
    { timeout = 0, signal }: WaitOptions
  ): Promise<T> {
    // Attempt to bypass listeners if match already exists.
    const item: T | undefined = this.find(filter)
    if (item) {
      return item
    }

    // Abort immediately on zero-second timeouts.
    if (timeout <= 0) {
      throw new AwaitedTimeoutError(timeout)
    }

    return new Promise<T>((resolve, reject) => {
      // Due to overlapping hooks, context must be defined outside functions.
      let timer: NodeJS.Timer | undefined = undefined
      const registry: this = this

      // 1. Listen for registrations.
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      function onRegister(item: T): void {
        if (registry.#match(item, filter)) {
          registry.removeListener(REGISTER_EVENT, onRegister)
          signal?.removeEventListener("abort", onAbort)
          clearTimeout(timer)
          resolve(item)
        }
      }

      registry.addListener(REGISTER_EVENT, onRegister)

      // 2. Listen for early aborts.
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      function onAbort(): void {
        registry.removeListener(REGISTER_EVENT, onRegister)
        clearTimeout(timer)
        reject(new AwaitedAbortError())
      }

      signal?.addEventListener("abort", onAbort, { once: true })

      // 3. Set timeout.
      timer = setTimeout(() => {
        registry.removeListener(REGISTER_EVENT, onRegister)
        signal?.removeEventListener("abort", onAbort)
        reject(new AwaitedTimeoutError(timeout))
      }, timeout)

      // To avoid a race condition where an item registers while listeners
      // are attached, perform a final check.
      const item: T | undefined = this.find(filter)
      if (item) {
        resolve(item)
      }
    })
  }
}
