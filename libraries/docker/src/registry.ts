import { Registry } from "@nodesuite/registry"

import { DEFAULT_TIMEOUT } from "./constants"
import { ManagedContainer } from "./container"
import type { Container, ContainerOptions, Containers } from "./types"

/**
 * Container lifecycle manager.
 *
 * @public
 */
export class ContainerRegistry
  extends Registry<Container>
  implements Containers
{
  /**
   * Default time to wait for new containers.
   *
   * @public
   */
  public readonly timeout: number = DEFAULT_TIMEOUT

  /**
   * Constructor
   *
   * @public
   */
  public constructor() {
    super({
      events: {
        /** Remove container from registry on "close" event. */
        unregister: "close"
      }
    })
  }

  /**
   * Creates or finds a container.
   *
   * @remarks
   * Does not start the specified container, initializing ready state must be
   * handled separately.
   *
   * @param options - Container creation options.
   *
   * @public
   */
  public create(options: ContainerOptions): Container {
    const name: string = options.name
    const existing: Container | undefined = this.find(name)
    if (existing) {
      return existing
    } else {
      this.lock(name)
      const container: Container = new ManagedContainer(options)
      this.register(name, container)
      return container
    }
  }

  /**
   * Finds and starts a container with a specified id.
   *
   * @param options - Container creation options.
   *
   * @public
   */
  public async resolve(options: ContainerOptions): Promise<Container> {
    const name: string = options.name

    // Check for existing named container or create a new one.
    const container: Container = this.has(name)
      ? await this.waitForItem(name, { timeout: this.timeout })
      : this.create(options)

    // Ensure start process has commenced.
    await container.run()

    return container
  }
}
