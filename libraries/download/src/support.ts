import { randomUUID } from "node:crypto"

import type { ExtractedUrl, FilenameFormat } from "./types"

/**
 * Casts a string or URL object as a new URL object.
 *
 * @param url - String or existing URL to cast.
 *
 * @public
 */
export const toUrl = (url: string | URL): URL =>
  typeof url === "string" ? new URL(url) : url

/**
 * Extracts elements from a valid url to use for filename construction.
 *
 * @param url - String or url to extract.
 *
 * @public
 */
export const extractUrl = (url: string | URL): ExtractedUrl => {
  const { hostname, pathname } = toUrl(url)
  const segments: string[] = pathname.split("/").filter((segment) => !!segment)
  const filename: string = segments.pop()?.trim() ?? ""
  const path: string = segments.join("-").trim()
  const ext: string = filename.split(".").pop()?.trim() ?? ""

  return { ext, filename, hostname, path }
}

/**
 * Parses a string value to remove invalid filename characters.
 *
 * @param value - Filename value to parse.
 *
 * @internal
 */
const parse = (value: string): string =>
  value.toLowerCase().replace(/\W+/g, `-`).replace(/-+/g, `-`)

/**
 * Converts a valid url to a safe file name using hostname and pathname values.
 *
 * @param url - URL to parse to filename.
 * @param format - Format to use for filename generation. Note that "original" and "url" may result in conflicts.
 *
 * @public
 */
export const urlToFileName = (
  url: string | URL,
  format: FilenameFormat = "original"
): string => {
  const { ext, filename, hostname, path } = extractUrl(url)

  switch (format) {
    case "url":
      return `${parse(`${hostname}${path}`)}_${filename}`
    case "timestamp":
      return `${Date.now()}.${ext}`
    case "uuid":
      return `${randomUUID()}.${ext}`
    case "original":
    default:
      return `${filename}`
  }
}
