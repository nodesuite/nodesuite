export class DeserializationError extends Error {
  public constructor() {
    super(`Deserialization failed.`)
  }
}

export class MissingRequiredValueError extends Error {
  public constructor() {
    super(`Missing required option value.`)
  }
}

export class UnfilterableValueError extends Error {
  public readonly value: unknown

  public constructor(value: unknown) {
    super(`Invalid source value provided to object filter function.`)
    this.value = value
  }
}

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

export class FileReadError extends Error {
  public constructor() {
    super()
  }
}
