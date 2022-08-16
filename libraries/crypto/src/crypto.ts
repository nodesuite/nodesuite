import { subtle } from "node:crypto"

import { decode, encode } from "./encoding"
import { generateSecureIv } from "./iv"
import type { Decrypted, Encrypt, Encrypted } from "./types"

/**
 * Current AES params.
 *
 * @internal
 */
const algorithm: Omit<AesGcmParams, "iv"> = {
  name: "AES-GCM",
  tagLength: 256
}

/**
 * Encrypts a data payload.
 *
 * @remarks
 * Always generate a new iv every time, recommended 12-byte length.
 * Tag length options are 32, 64, 96, 104, 112, 120, 128 (default).
 *
 * @param data - Payload to encrypt. Recommend object, but will accept simple strings as well.
 * @param key - Private key to use for encryption.
 * @param iv - Unique initialization vector.
 *
 * @public
 */
export const encrypt = async ({
  key,
  iv,
  data
}: Encrypt): Promise<Encrypted> => {
  iv = iv ?? generateSecureIv()
  return {
    iv,
    key,
    data: await subtle.encrypt(
      {
        ...algorithm,
        iv
      },
      key,
      encode(data)
    )
  }
}

/**
 * Decrypts a message payload.
 *
 * @remarks
 * Always generate a new iv every time, recommended 12-byte length.
 * Tag length options are 32, 64, 96, 104, 112, 120, 128 (default).
 *
 * @param data - Payload to decrypt.
 * @param key - Private key to use for encryption.
 * @param iv - Unique initialization vector.
 *
 * @public
 */
export const decrypt = async <T>({
  key,
  iv,
  data
}: Encrypted): Promise<Decrypted<T>> => ({
  key,
  iv,
  data: decode(
    await subtle.decrypt(
      {
        ...algorithm,
        iv
      },
      key,
      data
    )
  )
})
