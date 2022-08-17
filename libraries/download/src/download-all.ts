import { resolve } from "node:path"

import { download } from "./download"
import { DownloadError, UnexpectedError } from "./errors"
import { urlToFileName } from "./support"
import type { Options } from "./types"

/**
 * Downloads multiple files concurrently to an array.
 *
 * @public
 */
export const downloadAll = async (
  urls: (string | URL)[],
  dir: string,
  { filenames }: Options = {}
): Promise<string[]> => {
  try {
    // Stream all downloads concurrently for performance.
    return Promise.all(
      urls.map(async (url) =>
        download(url, resolve(dir, `${urlToFileName(url, filenames)}`))
      )
    )
  } catch (error) {
    if (error instanceof DownloadError) {
      console.error(error.message)
      throw error
    } else {
      throw new UnexpectedError(error as Error)
    }
  }
}
