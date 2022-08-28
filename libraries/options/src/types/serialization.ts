export type Type = "string" | "number" | "boolean" | "object"
export type Serializable = string | number | boolean | object

export type Deserialize<T extends Type> = Extract<
  T extends "string"
    ? string | undefined
    : T extends "number"
    ? number | undefined
    : T extends "boolean"
    ? boolean | undefined
    : T extends "object"
    ? object | undefined
    : never,
  Serializable | undefined
>

export type Serialize<T extends Serializable> = Extract<
  T extends string
    ? "string"
    : T extends number
    ? "number"
    : T extends boolean
    ? "boolean"
    : T extends object
    ? "object"
    : never,
  Type
>

export type SerializedRecord<K extends string = string> = Record<
  K,
  Serializable | undefined
>
