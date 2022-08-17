/**
 * Expected error type encountered during streaming.
 *
 * @internal
 */
export type StreamError = NodeJS.ErrnoException | null

/**
 * Methods used to format filenames when downloading multiple files.
 *
 * @remarks
 * Note that if "original" or "url" is selected, overwrites may occur.
 *
 * @public
 */
export type FilenameFormat = "original" | "url" | "uuid" | "timestamp"

/**
 * Options for multiple file downloads.
 *
 * @public
 */
export interface Options {
  // Format to use when casting filenames from urls.
  filenames?: FilenameFormat
}

/**
 * Elements extracted from a URL object used in filename creation.
 *
 * @internal
 */
export interface ExtractedUrl {
  ext: string
  filename: string
  hostname: string
  path: string
}
