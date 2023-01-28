/**
 * Generic error which can be thrown to reject unexpected input.
 *
 * @public
 */
export class UnexpectedValueError extends Error {
  public readonly expected: unknown
  public readonly received: unknown
  public constructor(expected: unknown, received: unknown) {
    super(
      [
        `Received invalid input.`,
        `Expected "${JSON.stringify(expected)}", but received "${JSON.stringify(
          received
        )}".`
      ].join(" ")
    )
    this.name = "UnexpectedValueError"
  }
}
