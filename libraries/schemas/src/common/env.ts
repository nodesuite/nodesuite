import { z } from "zod"

/**
 * Readonly array of all valid Node environment values.
 *
 * @public
 */
export const nodeEnvs = ["development", "production", "test"] as const

/**
 * Union type of Node environment values.
 *
 * @public
 */
export type NodeEnv = typeof nodeEnvs[number]

/**
 * Type guard to check if string value is a Node environment value.
 *
 * @param value - String value to check.
 *
 * @public
 */
export const isNodeEnv = (value: string = ""): value is NodeEnv =>
  (nodeEnvs as ReadonlyArray<string>).includes(value)

/**
 * Zod schema to parse valid Node environment values.
 *
 * @public
 */
export const NodeEnvSchema = z.enum(nodeEnvs)

/**
 * Parses a value as a valid Node environment value.
 *
 * @param value - Any value to parse as a Node environment value.
 *
 * @public
 */
export const parseNodeEnv = (value: unknown): NodeEnv =>
  NodeEnvSchema.parse(value)
