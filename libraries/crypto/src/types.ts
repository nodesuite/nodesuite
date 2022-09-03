import type { webcrypto } from "node:crypto"

/**
 * Return type from an encryption call.
 *
 * @public
 */
export interface Encrypted {
  // Initialization vector.
  iv: Uint8Array
  // Encryption key.
  key: CryptoKey
  // Encrypted data.
  data: BufferSource
}

/**
 * Return type from a decryption call.
 *
 * @public
 */
export interface Decrypted<T> {
  // Initialization vector.
  iv: Uint8Array
  // Encryption key.
  key: CryptoKey
  // Decrypted data.
  data: T
}

/**
 * Params for an encryption call.
 *
 * @public
 */
export interface Encrypt {
  // Initialization vector.
  iv?: Uint8Array
  // Encryption key.
  key: CryptoKey
  // Decrypted data.
  data: string | object | Uint8Array
}

/**
 * Type guard to test if a value is a valid buffer.
 *
 * @param value - Unknown value to test.
 *
 * @internal
 */
export const isBuffer = (value: unknown): value is Uint8Array =>
  typeof value === "object" &&
  value !== null &&
  ["Int8Array", "Uint8Array", "Uint8ClampedArray"].includes(
    Object.prototype.toString.call(value).slice(8, -1)
  )

/**
 * Node `webcrypto` AesGcmParams type.
 *
 * @see https://nodejs.org/api/webcrypto.html
 *
 * @public
 */
export type AesGcmParams = webcrypto.AesGcmParams

/**
 * Node `webcrypto` CryptoKey type.
 *
 * @see https://nodejs.org/api/webcrypto.html
 *
 * @public
 */
export type CryptoKey = webcrypto.CryptoKey

/**
 * Node `webcrypto` BufferSource type.
 *
 * @see https://nodejs.org/api/webcrypto.html
 *
 * @public
 */
export type BufferSource = webcrypto.BufferSource

/**
 * Node `webcrypto` AesKeyAlgorithm type.
 *
 * @see https://nodejs.org/api/webcrypto.html
 *
 * @public
 */
export type AesKeyAlgorithm = webcrypto.AesKeyAlgorithm

/**
 * Node `webcrypto` JsonWebKey type.
 *
 * @see https://nodejs.org/api/webcrypto.html
 *
 * @public
 */
export type JsonWebKey = webcrypto.JsonWebKey
