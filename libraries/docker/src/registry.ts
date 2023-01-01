import { Registry } from "@nodesuite/registry"

import { DEFAULT_TIMEOUT } from "./constants"
import { ManagedContainer } from "./container"
import type { ContainerFactory } from "./types"
import type {
  Container,
  ContainerOptions,
  ContainerRegistryConfig,
  Containers
} from "./types"

/**
 * Container lifecycle manager.
 *
 * @public
 */
export class ContainerRegistry<O extends ContainerOptions = ContainerOptions>
  extends Registry<Container>
  implements Containers<O>
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
  public constructor({ create }: ContainerRegistryConfig<O> = {}) {
    super({
      events: {
        /** Remove container from registry on "close" event. */
        unregister: "close"
      }
    })

    // Override default factory if a custom one is provided.
    if (create) {
      this.#create = create
    }
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
  public create(options: O): Container {
    const name: string = options.name
    const existing: Container | undefined = this.find(name)
    if (existing) {
      return existing
    } else {
      this.lock(name)
      const container: Container = this.#create(options)
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
  public async resolve(options: O): Promise<Container> {
    const name: string = options.name

    // Check for existing named container or create a new one.
    const container: Container = this.has(name)
      ? await this.waitForItem(name, { timeout: this.timeout })
      : this.create(options)

    // Ensure start process has commenced.
    await container.run()

    return container
  }

  /**
   * New container factory.
   *
   * @remarks
   * Can be provided at constructor for custom containers, or defaults to
   * default container class.
   *
   * @internal
   */
  readonly #create: ContainerFactory<O> = (options: O): Container =>
    new ManagedContainer(options)
}
