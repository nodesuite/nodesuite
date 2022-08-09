export const [BIGINT, BOOLEAN, NULL, NUMBER, STRING, SYMBOL, UNDEFINED] = [
  "bigint",
  "boolean",
  "null",
  "number",
  "string",
  "symbol",
  "undefined"
] as const

export const primitiveTypeNames = [
  BIGINT,
  BOOLEAN,
  NULL,
  NUMBER,
  STRING,
  SYMBOL,
  UNDEFINED
] as const

export type PrimitiveTypeName = typeof primitiveTypeNames[number]

export const typedArrayTypeNames = [
  "BigInt64Array",
  "BigUint64Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array"
] as const

export type TypedArrayTypeName = typeof typedArrayTypeNames[number]

export const [
  ARRAY,
  ARRAY_BUFFER,
  BUFFER,
  DATE,
  ERROR,
  FUNCTION,
  HTML_ELEMENT,
  MAP,
  OBJECT,
  PROMISE,
  REGEXP,
  SET,
  SHARED_ARRAY_BUFFER,
  URL,
  URL_SEARCH_PARAMS,
  WEAK_MAP,
  WEAK_SET
] = [
  "Array",
  "ArrayBuffer",
  "Buffer",
  "Date",
  "Error",
  "Function",
  "HTMLElement",
  "Map",
  "Object",
  "Promise",
  "RegExp",
  "Set",
  "SharedArrayBuffer",
  "URL",
  "URLSearchParams",
  "WeakMap",
  "WeakSet"
] as const

export const objectTypeNames = [
  ARRAY,
  ARRAY_BUFFER,
  BUFFER,
  DATE,
  ERROR,
  FUNCTION,
  HTML_ELEMENT,
  MAP,
  OBJECT,
  PROMISE,
  REGEXP,
  SET,
  SHARED_ARRAY_BUFFER,
  URL,
  URL_SEARCH_PARAMS,
  WEAK_MAP,
  WEAK_SET,
  ...typedArrayTypeNames
] as const

export type ObjectTypeName = typeof objectTypeNames[number]

export type TypeName = ObjectTypeName | PrimitiveTypeName
