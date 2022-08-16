import { ZodObject } from "zod"
import type { ZodRawShape, ZodTypeAny } from "zod"

/**
 * Type guard to test if a value is a valid ZodObject schema.
 *
 * @param schema - Possible schema to test.
 *
 * @public
 */
export const isZodObject = <T extends object>(
  schema: object
): schema is ZodObject<ZodRawShape, "strip", ZodTypeAny, T> =>
  schema &&
  (schema instanceof ZodObject || Object.keys(schema).includes("shape"))
