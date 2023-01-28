/**
 * Used as a default exception when none is provided to `nonNullable`.
 *
 * @public
 */
export class NonNullableError extends Error {
  public readonly reason: string

  public constructor(
    reason: string = `Encountered an empty value, but the value must be set.`
  ) {
    super(
      `${reason} This error is thrown by the nonNullable() function when a value is required but not set.`
    )
    this.name = "NonNullableError"
    this.reason = reason
  }
}
