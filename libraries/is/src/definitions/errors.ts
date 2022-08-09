import { isObjectOfType } from "../types"

/** Error Types **/

export const isError = isObjectOfType<Error>("Error")
