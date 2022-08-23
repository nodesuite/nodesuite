import type { Logger, Os } from "./types"

/**
 * Resolves the "os" description from current process.
 *
 * @internal
 */
export const getOs = (): Os => {
  switch (process.platform) {
    case "darwin":
      return "macOS"
    case "win32":
      return "Windows"
    default:
      return "Linux"
  }
}

/**
 * Default / fallback logger to use if no custom logger is provided.
 *
 * @internal
 */
export const fallbackLogger: Logger = {
  debug: console.debug.bind(console),
  info: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
}
