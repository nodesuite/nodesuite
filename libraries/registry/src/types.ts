import type { EventEmitter } from "node:events"

/**
 * All event names as constants.
 *
 * @public
 */
export const [
  REGISTER_EVENT,
  UNREGISTER_EVENT,
  EMPTY_EVENT,
  WAIT_EVENT,
  TIMEOUT_EVENT,
  ERROR_EVENT
] = ["register", "unregister", "empty", "wait", "timeout", "error"] as const

/**
 * All event names as array.
 *
 * @public
 */
export const events = [
  REGISTER_EVENT,
  UNREGISTER_EVENT,
  EMPTY_EVENT,
  WAIT_EVENT,
  TIMEOUT_EVENT,
  ERROR_EVENT
] as const

/**
 * All emitted event names.
 *
 * @public
 */
export type Event = typeof events[number]

/**
 * Clear typing of id string.
 *
 * @public
 */
export type Id = string

/**
 * Abstract user-provided hook function.
 *
 * @public
 */
export type Hook = (...args: unknown[]) => unknown

/**
 * Type guard to determine if input is a hook function.
 *
 * @param value - Any value to test.
 *
 * @internal
 */
export const isHook = (value: unknown): value is Hook =>
  typeof value === "function"

/**
 * Abstract eventful item.
 *
 * @public
 */
export type Item = EventEmitter

/**
 * Internal map of registry items.
 *
 * @internal
 */
export type RegistryItems<T extends Item> = Map<string, T | undefined>

/**
 * Definition of important item level lifecycle event names.
 *
 * @public
 */
export interface LifecycleEvents {
  /** Event name on item to trigger completed registration. Example: "ready". */
  register?: string
  /** Event name of item to trigger a de-registration. Example: "close". */
  unregister?: string
}

/**
 * Definition of important registry level lifecycle event actions.
 */
export interface LifecycleActions {
  /** Action to perform when the registry map reduces to zero. */
  onEmpty?: "abort" | Hook | undefined
}

/**
 * Initial configuration object provided to constructor.
 *
 * @public
 */
export interface RegistryConfig {
  /** List of item level lifecycle event name mappings. */
  events?: LifecycleEvents
  /** List of registry level lifecycle event actions instructions. */
  actions?: LifecycleActions
  /** If a abort bubbling is required, a parent abort controller can be set. */
  abort?: AbortController
}

/**
 * Allows matching of an item based on a key value pair.
 *
 * @public
 */
export interface FilterObject<T extends Item, K extends keyof T> {
  key: K
  value: T[K] | RegExp
}

/**
 * Allows matching of an item based on an array-style filter function.
 *
 * @public
 */
export type FilterFunction<T extends Item> = (item: T) => boolean

/**
 * Compound filter type to allow registry id strings, filter objects, or
 * filter functions.
 *
 * @public
 */
export type Filter<T extends Item> =
  | Id
  | FilterObject<T, keyof T>
  | FilterFunction<T>

/**
 * Abstract registry interface.
 *
 * @public
 */
export interface EventfulRegistry<T extends Item> extends EventEmitter {
  /** Array of all locked ids. */
  ids(): string[]

  /** Tests if an item matching a given id exists. */
  has(id: string): boolean

  /** Checks if the registry has registered any items. */
  hasItems(): boolean

  /** Filterable array of all registered items. */
  list(filter?: Filter<T>): T[]

  /** Reports the number of items registered. */
  count(filter?: Filter<T>): number

  /** Attempts to find an existing item by filter. */
  find(filter: Filter<T>): T | undefined

  /** Locks an id to prevent multiple deferred items sharing the same id. */
  lock(id: string): void

  /** Handles registration of a new eventful item. */
  register(id: Id, item: T): void

  /** Handles de-registration of an existing eventful item. */
  unregister(id: Id, item: T): void

  /** Returns the first registered item, or waits for one to be registered. */
  first(options?: WaitOptions): Promise<T>

  /** Waits for a deferred item matching a given filter. */
  waitForItem(filter: Filter<T>, options?: WaitOptions): Promise<T>

  /** Waits for the next item to be registered. */
  waitForNextItem(options?: WaitOptions): Promise<T>
}

/**
 * Options to modify the behavior of the awaited search methods.
 *
 * @public
 */
export interface WaitOptions {
  /** Timeout in ms. If unset, will default to zero. */
  timeout?: number
  /** Optional abort signal to terminate wait externally. */
  signal?: AbortSignal
}
