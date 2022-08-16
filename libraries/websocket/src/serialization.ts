import { DeserializationError, SerializationError } from "./errors"
import { isRawWebSocketData } from "./types"
import type { RawWebSocketData, Serializable } from "./types"

/**
 * Serializes value to string prior to sending via websocket.
 *
 * @param value - Value to serialize.
 *
 * @public
 */
export const serialize = (value: Serializable | RawWebSocketData): string => {
  try {
    return typeof value === "string"
      ? value.trim()
      : isRawWebSocketData(value)
      ? value.toString("utf8")
      : JSON.stringify(value)
  } catch (error) {
    throw new SerializationError(value, error as Error)
  }
}

/**
 * Deserializes an incoming websocket data buffer.
 *
 * @param value - Value to deserialize.
 *
 * @public
 */
export const deserialize = <T>(value: RawWebSocketData): T => {
  try {
    return JSON.parse(value.toString("utf8"))
  } catch (error) {
    throw new DeserializationError(value, error as Error)
  }
}
