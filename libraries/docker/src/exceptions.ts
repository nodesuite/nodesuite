/**
 * Throws if an available port cannot be found within a maximum number of
 * attempts.
 *
 * @public
 */
export class NoAvailablePortsError extends Error {
  public constructor(min: number, max: number, attempts: number) {
    super(
      [
        `Could not find an available port between ${min} - ${max} after ${attempts} attempts.`,
        `This occurs when the "tcp-port-used" package cannot locate an unused port from the specified range.`
      ].join(" ")
    )
  }
}

/**
 * Throws when a container does not respond on the expected port within timeout.
 *
 * @public
 */
export class ContainerTimeoutError extends Error {
  public constructor(portOrUrl?: number | URL) {
    super(
      [
        `Container not responding on "${portOrUrl}" after maximum timeout.`,
        `Often this is due to a slower connection not able to complete the "pull" download prior to the specified timeout.`,
        `To resolve, either set a longer timeout, or perform a local "docker pull" manually and allow the download to complete.`
      ].join(" ")
    )
  }
}

/**
 * Throws when no port is provided in options, and none can be resolved from
 * the commands default container.
 *
 * @public
 */
export class UndefinedPortError extends Error {
  public constructor() {
    super(
      `No port provided options or container factory unable to resolve a random port.`
    )
  }
}
