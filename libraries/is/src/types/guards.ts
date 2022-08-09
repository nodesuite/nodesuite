import {
  objectTypeNames,
  primitiveTypeNames,
  typedArrayTypeNames
} from "./constants"
import type { Primitive } from "./common"
import type {
  ObjectTypeName,
  PrimitiveTypeName,
  TypedArrayTypeName
} from "./constants"

export const isPrimitiveTypeName = (name: unknown): name is PrimitiveTypeName =>
  primitiveTypeNames.includes(name as PrimitiveTypeName)

export const isObjectTypeName = (name: unknown): name is ObjectTypeName =>
  objectTypeNames.includes(name as ObjectTypeName)

export const isTypedArrayName = (name: unknown): name is TypedArrayTypeName =>
  typedArrayTypeNames.includes(name as TypedArrayTypeName)

/**
 * Determines if an unknown value is of a specified type.
 *
 * @param type - Name of type to check.
 *
 * @public
 */
export const isOfType =
  <T extends Primitive | Function>(type: PrimitiveTypeName | "function") =>
  (value: unknown): value is T =>
    typeof value === type

/**
 * Extracts the string type name of an object.
 *
 * @param value - Object to test.
 *
 * @public
 */
const getObjectType = (value: unknown): ObjectTypeName | undefined => {
  const objectTypeName: string = Object.prototype.toString
    .call(value)
    .slice(8, -1)

  if (/HTML\w+Element/.test(objectTypeName)) {
    return "HTMLElement"
  }

  if (isObjectTypeName(objectTypeName)) {
    return objectTypeName
  }

  return undefined
}

/**
 * Determines if an unknown object is of a specified type.
 *
 * @param type - Name of type to check.
 *
 * @public
 */
export const isObjectOfType =
  <T>(type: ObjectTypeName) =>
  (value: unknown): value is T =>
    getObjectType(value) === type
