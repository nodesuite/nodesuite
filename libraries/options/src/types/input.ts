/**
 * Export valid file extensions as constants.
 *
 * @public
 */
export const [JSON_EXT, YML_EXT, YAML_EXT] = [".json", ".yml", ".yaml"] as const

/**
 * Export array of valid file extensions.
 *
 * @public
 */
export const validExtensions = [JSON_EXT, YML_EXT, YAML_EXT] as const

/**
 * Union type of valid file extensions.
 *
 * @public
 */
export type ValidExtension = typeof validExtensions[number]

/**
 * Abstract JSON river shape.
 *
 * @internal
 */
export type Reviver = (key: unknown, value: unknown) => string | undefined
