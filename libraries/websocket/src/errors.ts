/**
 * Throws if the websocket encounters an unexpected disconnect.
 *
 * @public
 */
export class UnexpectedCloseError extends Error {
  /**
   * Url of the source websocket.
   *
   * @public
   */
  public readonly url: string

  /**
   * Constructor
   *
   * @param url - Url of the source websocket.
   *
   * @public
   */
  public constructor(url: string) {
    super(`WebSocket closed unexpectedly when connecting to "${url}".`)
    this.name = "UnexpectedCloseError"
    this.url = url
  }
}

/**
 * Throws if an attempted deserialization of websocket data fails.
 *
 * @public
 */
export class SerializationError extends Error {
  /**
   * Data which failed serialization.
   *
   * @public
   */
  public readonly data: unknown

  /**
   * Constructor
   *
   * @param data - Data which failed serialization.
   * @param error - Original error.
   *
   * @public
   */
  public constructor(data: unknown, error: Error) {
    super(`Encountered error while serializing websocket message.`, {
      cause: error
    })
    this.name = "SerializationError"
    this.data = data
  }
}

/**
 * Throws if an attempted deserialization of websocket data fails.
 *
 * @public
 */
export class DeserializationError extends Error {
  /**
   * Raw websocket data received.
   *
   * @public
   */
  public readonly data: unknown

  /**
   * Constructor
   *
   * @param data - Raw websocket data received.
   * @param error - Original error.
   *
   * @public
   */
  public constructor(data: unknown, error: Error) {
    super(`Encountered error while deserializing raw websocket data.`, {
      cause: error
    })
    this.name = "DeserializationError"
    this.data = data
  }
}
