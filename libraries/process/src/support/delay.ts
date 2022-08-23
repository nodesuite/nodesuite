/**
 * Simple timeout function.
 *
 * @param ms - Number of milliseconds to wait.
 *
 * @internal
 */
export const delay = (ms: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))
