export type Type = "string" | "number" | "boolean" | "object" | "array"
export type Serializable = string | number | boolean | object | string[]

/**
 * Converts string representation to native type.
 *
 * @public
 */
export type Deserialize<T extends Type> = T extends "string"
  ? string | undefined
  : T extends "number"
  ? number | undefined
  : T extends "boolean"
  ? boolean | undefined
  : T extends "array"
  ? string[]
  : T extends "object"
  ? object | undefined
  : never

/**
 * Converts native type to string representation.
 *
 * @public
 */
export type Serialize<T extends Serializable> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends string[]
  ? "array"
  : T extends object
  ? "object"
  : never

/**
 * Abstract JSON river shape.
 *
 * @internal
 */
export type Reviver = (key: unknown, value: unknown) => string | undefined
