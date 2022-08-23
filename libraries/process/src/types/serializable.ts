/**
 * @internal
 */
export const [
  STRING_TYPE,
  OBJECT_TYPE,
  NUMBER_TYPE,
  BOOLEAN_TYPE,
  BIGINT_TYPE
] = ["string", "object", "number", "boolean", "bigint"] as const

/**
 * @internal
 */
export const serializableTypes = [
  STRING_TYPE,
  OBJECT_TYPE,
  NUMBER_TYPE,
  BOOLEAN_TYPE,
  BIGINT_TYPE
] as const

/**
 * @internal
 */
export type SerializableType = typeof serializableTypes[number]

/**
 * @internal
 */
export interface SerializableTypes {
  string: string
  object: object
  number: number
  boolean: boolean
  bigint: boolean
}
