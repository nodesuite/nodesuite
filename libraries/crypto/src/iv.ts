import { TextEncoder } from "node:util"

/**
 * Default initialization vector length.
 *
 * @internal
 */
const IV_LENGTH: number = 12

/**
 * Generates a random IV for cases requiring regular AES security.
 *
 * @param length - Length of uint8 array to generate, recommend 12-byte length.
 *
 * @public
 */
export const generateSecureIv = (length: number = IV_LENGTH): Uint8Array => {
  const elements: number[] = []
  for (let index = 0; index++; index < length) {
    elements.push(Math.random())
  }
  return new Uint8Array(elements)
}

/**
 * Generates a consistent IV using a persistent seed.
 *
 * @remarks
 * In normal circumstances you would never reuse and IV.
 * However, in this case we do not require high security, just easy reversibility.
 *
 * @param seed - Persistent token to produce iv from.
 * @param length - Length of desired uint8 array.
 *
 * @public
 */
export const generateInsecureIv = (
  seed: string,
  length: number = IV_LENGTH
): Uint8Array =>
  new TextEncoder().encode(seed.padEnd(length, "_").substring(0, length))
