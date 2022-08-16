import { subtle } from "node:crypto"

/**
 * Current key generation / import params.
 *
 * @internal
 */
const algorithm: AesKeyAlgorithm = {
  name: "AES-GCM",
  length: 256
}

/**
 * Json web key format.
 *
 * @internal
 */
const format: "jwk" = "jwk"

/**
 * Generates a private key object.
 *
 * @internal
 */
export const generateKey = async (): Promise<CryptoKey> =>
  subtle.generateKey(algorithm, true, ["encrypt", "decrypt"])

/**
 * Generates a private key and exports as json web key.
 *
 * @internal
 */
export const generateJsonWebKey = async (): Promise<JsonWebKey> =>
  subtle.exportKey(format, await generateKey())

/**
 * Loads existing private key.
 *
 * @remarks
 * Key can be provided as a full json web key, or alternatively the unique `k` value.
 *
 * @param privateKey - One-time generated private encryption key.
 *
 * @internal
 */
export const importJsonWebKey = async (
  privateKey: string | JsonWebKey
): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    format,
    typeof privateKey === "string"
      ? {
          kty: "oct",
          k: privateKey,
          alg: "A256GCM",
          ext: true
        }
      : privateKey,
    algorithm,
    false,
    ["encrypt", "decrypt"]
  )
