/**
 * Object containing resolved paths to each `.env` config file.
 *
 * @public
 */
export interface Paths {
  /** Primary .env file path. */
  path: string | undefined

  /** Primary .env file path. */
  defaults: string | undefined
}

/**
 * Full configuration object.
 *
 * @public
 */
export interface Config extends Partial<Paths> {
  /** Allows filtering of sensitive keys when called manually. */
  filters?: (string | RegExp)[]
}

/**
 * Dynamic output type for parsed env variables.
 *
 * @public
 */
export type Env<K extends string = string> = Partial<Record<K, string>>

/**
 * Configured env output object.
 *
 * @public
 */
export interface Output<E extends Env> {
  /** Parsed environment variables or empty object. **/
  env: E
  /** Any error surfaced while parsing files. */
  error?: Error
}
