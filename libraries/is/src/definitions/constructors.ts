import { isObjectOfType } from "../types"
import { isFunction } from "./common"
import type { Class } from "../types"

/** Constructor Types **/

export const isClass = (value: unknown): value is Class =>
  isFunction(value) && value.toString().startsWith("class ")

export const isDirectInstanceOf = <T>(
  instance: unknown,
  class_: Class<T>
): instance is T => Object.getPrototypeOf(instance) === class_.prototype

export const isUrlInstance = (value: unknown): value is URL =>
  isObjectOfType<URL>("URL")(value)
