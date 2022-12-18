<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/registry

## Summary

Handles lifecycle management of eventful items.

## Installation

```shell
npm install @nodesuite/registry
```

## Usage

```typescript
import { randomUUID } from "node:crypto"
import { EventEmitter } from "node:events"

import { Registry } from "./registry"
import type { EventfulRegistry } from "./types"

/**
 * Example "item" class.
 */
export type BrowserBuild = "chrome" | "firefox"
export class Browser extends EventEmitter {
	public readonly id: string

	public readonly build: BrowserBuild

	public constructor(id: string, build: BrowserBuild) {
		super()
		this.id = id
		this.build = build
	}

	public async launch(): Promise<void> {
		// ... Handle launch.
		this.emit("launch")
	}

	public async close(): Promise<void> {
		// ... Handle close.
		this.emit("close")
	}
}

/**
 * Example implementation of base registry.
 */
export class BrowserRegistry
	extends Registry<Browser>
	implements EventfulRegistry<Browser>
{
	/**
	 * Define browser-specific configuration.
	 */
	public constructor() {
		super({
			events: {
				register: "launch",
				unregister: "close"
			}
		})
	}
}

/**
 * Registry singleton.
 */

const registry: EventfulRegistry<Browser> = new BrowserRegistry()

/**
 * Example of separate creation and access of browser.
 */
const example = async (): Promise<void> => {
	// 1. Example of a queue worker creating a new browser instance:
	const createBrowser = async (
		id: string,
		build: BrowserBuild
	): Promise<void> => {
		// Create new eventful item.
		const browser: Browser = new Browser(id, build)

		// Lock the browsers id to allow early async access.
		registry.lock(browser.id)

		// Perform some heavy async action.
		await browser.launch()

		// Register browser in registry. This will auto-unregister on any close event.
		registry.register(browser.id, browser)
	}

	// 2. Access to expected browser id that may not be yet registered.
	const useBrowser = async (id: string): Promise<Browser> => {
		try {
			// Will wait a maximum of 30s for browser with id to register.
			const browser: Browser = await registry.waitForItem(id, {
				timeout: 30000
			})
			console.log(`Found browser ${id}!`)
			return browser
		} catch (error) {
			console.error(`Failed to find browser ${id}.`)
			throw error
		}
	}

	// 3. First available "firefox" browser.
	const useFirstFirefoxBrowsers = async (): Promise<Browser> => {
		try {
			// Will wait a maximum of 30s for browser with id to register.
			const browser: Browser = await registry.waitForItem(
				{
					key: "build",
					value: "firefox"
				},
				{
					timeout: 30000
				}
			)
			console.log(`Found firefox browser!`)
			return browser
		} catch (error) {
			console.error(`Failed to find firefox browser.`)
			throw error
		}
	}

	// Example resolution. In practice, these would be blind to each other.
	const chromeBrowserId: string = randomUUID()
	const firefoxBrowserId: string = randomUUID()

	const [chromeBrowser, firefoxBrowser] = await Promise.all([
		useBrowser(chromeBrowserId),
		useFirstFirefoxBrowsers(),
		createBrowser(chromeBrowserId, "chrome"),
		createBrowser(firefoxBrowserId, "firefox")
	])

	expect(chromeBrowser.id).toBe(chromeBrowserId)
	expect(chromeBrowser.build).toBe("chrome")
	expect(firefoxBrowser.id).toBe(firefoxBrowserId)
	expect(firefoxBrowser.build).toBe("firefox")
}
```
