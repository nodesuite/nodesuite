import { z } from "zod"

/**
 * Regex for validating IP v4 addresses.
 *
 * @public
 */
export const IP_V4_REGEX: RegExp =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/

/**
 * Guard to test if value is a valid IPv4 string.
 *
 * @param value - String value to test.
 *
 * @public
 */
export const isIp = (value: string = ""): boolean => !!value.match(IP_V4_REGEX)

/**
 * Zod schema for validating IP strings.
 *
 * @public
 */
export const IpSchema = z.string().regex(IP_V4_REGEX)

/**
 * Parse an unknown value as a valid IPv4 string.
 *
 * @param value - Any value to parse as IPv4 string.
 *
 * @public
 */
export const parseIp = (value: unknown): string => IpSchema.parse(value)
