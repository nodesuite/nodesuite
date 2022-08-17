/**
 * Throws when download attempt fails.
 *
 * @public
 */
export class DownloadError extends Error {
  public readonly url: string | URL

  public constructor(url: string | URL, error: Error) {
    super(`Encountered error downloading file "${url}": ${error.message}`, {
      cause: error
    })
    this.url = url
  }
}

/**
 * Throws when an unexpected error is encountered while downloading.
 *
 * @public
 */
export class UnexpectedError extends Error {
  public constructor(error: Error) {
    super(
      `Encountered an unexpected error while downloading": ${error.message}`,
      {
        cause: error
      }
    )
  }
}
