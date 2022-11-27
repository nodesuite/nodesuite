/**
 * Appends located keys.
 *
 * @internal
 */
type WithKeys<O extends object, K extends string> = {

  // Provide any new keys as unknown.
  [N in Exclude<K, keyof O>]: unknown
} &
  O

/**
 * Checks if a provided object explicitly has a set of keys.
 *
 * @remarks
 * Generally used as part of a type guard.
 *
 * @param value - Object to inspect.
 * @param validKeys - Array of valid keys to confirm.
 *
 * @public
 */
export const hasKeys = <O extends object, K extends string>(
  value: O,
  ...validKeys: K[]
): value is WithKeys<O, K> =>
  validKeys.every((key) => Object.keys(value).includes(key))

/**
 * Omits invalid keys.
 *
 * @internal
 */
type WithoutKeys<O extends object, K extends string> = Omit<O, K>

/**
 * Determines if a provided object is explicitly missing a set of invalid keys.
 *
 * @remarks
 * Generally used as part of a type guard.
 *
 * @param value - Object to inspect.
 * @param invalidKeys - Invalid keys to check.
 *
 * @public
 */
export const doesNotHaveKeys = <O extends object, K extends string>(
  value: object,
  ...invalidKeys: K[]
): value is WithoutKeys<O, K> =>
  invalidKeys.every((key) => !Object.keys(value).includes(key))
