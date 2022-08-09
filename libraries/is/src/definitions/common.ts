import { DATE, REGEXP, SYMBOL } from "../types"
import { isObjectOfType, isOfType, isPrimitiveTypeName } from "../types"
import { isNull } from "./nulls"
import type { Primitive } from "../types"

/** Primitive Types **/

export const isPrimitive = (value: unknown): value is Primitive =>
  isNull(value) || isPrimitiveTypeName(typeof value)

export const isSymbol = isOfType<symbol>(SYMBOL)

export const isFunction = isOfType<Function>("function")

export const isDate = isObjectOfType<Date>(DATE)

export const isRegExp = isObjectOfType<RegExp>(REGEXP)
