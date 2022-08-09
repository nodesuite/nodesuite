import { ARRAY_BUFFER, isObjectOfType, SHARED_ARRAY_BUFFER } from "../types"

export const isBuffer = (value: unknown): value is Buffer =>
  (value as any)?.constructor?.isBuffer?.(value) ?? false

export const isArrayBuffer = isObjectOfType<ArrayBuffer>(ARRAY_BUFFER)

export const isSharedArrayBuffer = isObjectOfType<SharedArrayBuffer>(
  SHARED_ARRAY_BUFFER
)
