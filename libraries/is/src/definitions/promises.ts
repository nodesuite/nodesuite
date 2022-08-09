import { isObjectOfType } from "../types"

/** Promise Types **/

export const isNativePromise = <T = unknown>(
  value: unknown
): value is Promise<T> => isObjectOfType<Promise<T>>("Promise")(value)
