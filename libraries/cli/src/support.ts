import { platform } from "node:os"

import type { OperatingSystem } from "./types"

/**
 * Resolves the "os" description from current process.
 *
 * @internal
 */
export const getOs = (): OperatingSystem => {
  switch (platform()) {
    case "darwin":
      return "macOS"
    case "win32":
      return "Windows"
    default:
      return "Linux"
  }
}
