import { isEmail, isLocale, isMD5, isSlug, isUrl, isUUID4 } from "@nodesuite/is"
import type { Format } from "convict"

/**
 * Allows convict to parse urls.
 *
 * @public
 */
export const urlFormat: Format = {
  name: "url",
  validate: (value: unknown) => isUrl(value),
  coerce: (value: unknown) => String(value).trim()
}

/**
 * Allows convict to parse comma separated string values.
 *
 * @public
 */
export const emailFormat: Format = {
  name: "email",
  validate: (value: unknown) => isEmail(value),
  coerce: (value: unknown) => String(value).trim()
}

/**
 * Allows convict to parse md5 string values.
 *
 * @public
 */
export const md5Format: Format = {
  name: "md5",
  validate: (value: unknown) => isMD5(value),
  coerce: (value: unknown) => String(value).trim()
}

/**
 * Allows convict to parse slug string values.
 *
 * @public
 */
export const slugFormat: Format = {
  name: "slug",
  validate: (value: unknown) => isSlug(value),
  coerce: (value: unknown) => String(value).trim()
}

/**
 * Allows convict to parse uuid v4 string values.
 *
 * @public
 */
export const uuidFormat: Format = {
  name: "uuid",
  validate: (value: unknown) => isUUID4(value),
  coerce: (value: unknown) => String(value).trim()
}

/**
 * Allows convict to parse locale string values.
 *
 * @public
 */
export const localeFormat: Format = {
  name: "locale",
  validate: (value: unknown) => isLocale(value),
  coerce: (value: unknown) => String(value).trim()
}

/**
 * Allows convict to parse comma separated string values.
 *
 * @public
 */
export const csvFormat: Format = {
  name: "csv",
  validate: (value: unknown) => Array.isArray(value),
  coerce: (value: unknown) => {
    switch (typeof value) {
      case "string":
        return value.split(",").map((v) => v.trim())
      case "number":
      case "boolean":
      case "symbol":
      case "bigint":
        return [value.toString()]
      case "object":
        if (Array.isArray(value)) {
          return value.map((v) => `${v}`.trim())
        }
        if (value === null) {
          return []
        }
        return Object.values(value).map((v) => `${v}`.trim())
      case "undefined":
      default:
        return []
    }
  }
}
