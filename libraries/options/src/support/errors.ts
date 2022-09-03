/**
 * Throws if deserialization fails for any reason.
 *
 * @public
 */
export class DeserializationError extends Error {
  public constructor() {
    super(`Deserialization failed.`)
  }
}

/**
 * Throws if a value marked as non-optional is undefined and has no default value.
 *
 * @public
 */
export class MissingRequiredValueError extends Error {
  public constructor() {
    super(`Missing required option value.`)
  }
}

/**
 * Throws if a value other than an object is passed to the filter function.
 *
 * @public
 */
export class InvalidObjectError extends Error {
  public readonly value: unknown

  public constructor(value: unknown) {
    super(`Invalid source value provided to object filter function.`)
    this.value = value
  }
}

/**
 * Throws if an empty or invalid path is provided to a filesystem function.
 *
 * @public
 */
export class InvalidFilePathError extends Error {
  public readonly filePath?: string
  public readonly extensions: string[]

  public constructor(filePath?: string, extensions: string[] = []) {
    super(
      `Invalid or missing file path "${filePath}". File extension must be one of: ${extensions.join(
        ", "
      )}`
    )
    this.filePath = filePath
    this.extensions = extensions
  }
}

/**
 * Throws if file system read function fails for any reason.
 *
 * @public
 */
export class FileReadError extends Error {
  public readonly filePath: string

  public constructor(filePath: string, cause: Error) {
    super(
      `Encountered error while attempting to read file "${filePath}": ${cause.message}`,
      { cause }
    )
    this.filePath = filePath
  }
}
