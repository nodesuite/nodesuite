/**
 * Converts an object to a prettified json string.
 *
 * @public
 */
export const stringify = (obj: object): string =>
  JSON.stringify(obj, undefined, 2)
