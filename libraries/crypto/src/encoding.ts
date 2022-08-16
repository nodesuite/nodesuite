import { TextDecoder, TextEncoder } from "node:util"

import { isBuffer } from "./types"

/**
 * Text encoder instance.
 *
 * @internal
 */
const _encoder: TextEncoder = new TextEncoder()

/**
 * Text decoder instance.
 *
 * @internal
 */
const _decoder: TextDecoder = new TextDecoder()

/**
 * Encodes data to Unit8Array for encryption.
 *
 * @remarks
 * If value is already encoded, will return original.
 *
 * @param data - Payload to encode.
 *
 * @public
 */
export const encode = (data: object | string | Uint8Array): Uint8Array => {
  if (isBuffer(data)) {
    return data
  } else {
    return _encoder.encode(JSON.stringify(data))
  }
}

/**
 * Decodes data from Unit8Array payload produced by decryption.
 *
 * @param data - Uint8Array payload to decode.
 *
 * @public
 */
export const decode = (data: Uint8Array | ArrayBuffer) =>
  JSON.parse(_decoder.decode(data))
