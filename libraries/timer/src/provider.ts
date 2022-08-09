import { Timer } from "./timer"
import type { PerformanceTimer } from "./types"

/**
 * Creates a new timer instance.
 */
export const useTimer = (): PerformanceTimer => new Timer()
