import { isObject } from "@nodesuite/is"

/**
 * Keys to ignore during extraction.
 *
 * @internal
 */
const ignoredKeys: Set<string> = new Set<string>([
  "__proto__",
  "prototype",
  "constructor"
])

/**
 * Recursively extracts and flattens keys from an object.
 *
 * @param options - Source object to extract from.
 * @param parentKey - If nested, parent key that called the function for flattening.
 *
 * @public
 */
export const extractKeys = <T extends object>(
  options: T,
  parentKey: string = ""
): string[] =>
  Object.entries(options)
    .flatMap(([key, value]) => {
      if (ignoredKeys.has(key)) {
        return
      }
      const compoundKey: string = [parentKey, key].filter((k) => !!k).join(".")
      return isObject(value) ? extractKeys(value, compoundKey) : compoundKey
    })
    .filter((key) => !!key) as string[]
