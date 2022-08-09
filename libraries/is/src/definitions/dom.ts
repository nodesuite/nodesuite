import { isObject, isPlainObject } from "./objects"
import { isString } from "./strings"

const NODE_TYPE_ELEMENT = 1
const DOM_PROPERTIES_TO_CHECK: Array<keyof HTMLElement> = [
  "innerHTML",
  "ownerDocument",
  "style",
  "attributes",
  "nodeValue"
]

/** DOM Types **/

export const isDomElement = (value: unknown): value is HTMLElement => (
    isObject(value) &&
    (value as HTMLElement).nodeType === NODE_TYPE_ELEMENT &&
    isString((value as HTMLElement).nodeName) &&
    !isPlainObject(value) &&
    DOM_PROPERTIES_TO_CHECK.every((property) => property in value)
  )
