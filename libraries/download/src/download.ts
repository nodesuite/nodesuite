import { createWriteStream } from "node:fs"
import { get } from "node:https"
import type { WriteStream } from "node:fs"

import { DownloadError } from "./errors"
import { toUrl } from "./support"
import type { StreamError } from "./types"

/**
 * Downloads a remote file to local destination.
 *
 * @param url - URL to download from.
 * @param path - Local filesystem path (including filename) to download to.
 *
 * @throws DownloadError
 * @returns String path to successfully downloaded file.
 *
 * @public
 */
export const download = async (
  url: string | URL,
  path: string
): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    try {
      // Create output stream to destination file.
      const output: WriteStream = createWriteStream(path)
      // Trigger download stream and pipe output to file.
      get(toUrl(url), (input) => input.pipe(output))
      // Resolve once complete.
      output.on("finish", () =>
        output.close((error?: StreamError) => {
          if (error) {
            reject(new DownloadError(url, error))
          } else {
            resolve(path)
          }
        })
      )
    } catch (error) {
      reject(new DownloadError(url, error as Error))
    }
  })
