<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/docker

Manage Docker containers as child processes.

## Installation

```shell
npm install @nodesuite/docker
```

# Overview

- Handles container and child process lifecycle events with locking and automatic de-registration via a provided
  `@nodesuite/registry` instance.
- Define a `docker run` as a convenient configuration object.
- Push internal messages as events from container as events.

## Usage

```typescript
import type { ContainerOptions, Containers } from "@nodesuite/docker"
import { ContainerRegistry } from "@nodesuite/docker"

const registry: Containers = new ContainerRegistry()

const example = async () => {
	const options: ContainerOptions = {
		image: `ghcr.io/<my-org>/<my-container>`, // Hostname of image.
		name: `my-unique-name`, // Unique name, existing containers sharing name will be killed.
		tag: `latest`,
		user: `root`, // Internal user to execute from.
		entrypoint: `./boot.sh`, // Resolved from home directory.
		command: `/usr/bin/bash`, // Resolve from absolute path.
		ports: [
			[3000, 3000], // External + internal ports to expose.
			[9222, 19222]
		],
		env: {
			NODE_ENV: `development`, // Any environment variables to inject.
			FOO: `foo`
		},
		volumes: [
			[`./app`, `./app`], // Resolved from cwd and home directory.
			[`/some/absolute/local/path`, `/opt/mount`] // Resolved from external and internal absolute paths.
		],
		cwd: path.resolve(`./some/local/path`) // Custom cwd for local path resolution.
	}

	// Option 1: Create and lock container name without trigger a full spawn / ready state.
	const container1 = await registry.create(options)
	// Spawn some time later in application:
	await container1.run()
	await container1.waitForServer(9222)

	// Option 2: Create, lock and spawn container immediately.
	const container2: Container = await registry.resolve(options)
	await container2.waitForServer(new URL(`http://localhost:3000/my-endpoint`))
}
```
