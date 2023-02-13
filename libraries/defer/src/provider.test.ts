import { defer } from "./provider"
import type { Deferral } from "./types"

/**
 * Deferral provider tests.
 */
describe("deferral provider tests", () => {
  // 1. Test resolve.
  test(`resolve returns expected value`, async () => {
    const deferral: Deferral<string> = defer<string>()

    const expectedValue: string = "resolved"

    const receivedValue: string = await new Promise<string>(
      (resolve, reject) => {
        deferral.untilResolved().then(resolve).catch(reject)

        deferral.resolve(expectedValue)
      }
    )

    expect(receivedValue).toEqual(expectedValue)
  })

  // 2. Test reject (string message).
  test(`reject returns expected string value`, async () => {
    const deferral: Deferral<string> = defer<string>()

    const expectedValue: string = "rejected"

    const receivedValue: string = await new Promise<string>(
      (resolve, reject) => {
        // Reject resolutions, resolve errors.
        deferral.untilResolved().then(reject).catch(resolve)

        deferral.reject(expectedValue)
      }
    )

    expect(receivedValue).toEqual(expectedValue)
  })

  // 3. Test reject (error instance).
  test(`reject returns expected error value`, async () => {
    const deferral: Deferral<string> = defer<string>()

    const expectedValue: Error = new Error()

    const receivedValue: Error = await new Promise<Error>((resolve, reject) => {
      // Reject resolutions, resolve errors.
      deferral.untilResolved().then(reject).catch(resolve)

      deferral.reject(expectedValue)
    })

    expect(receivedValue).toEqual(expectedValue)
  })

  // 4. Test abort.
  test(`abort signal rejects promise`, async () => {
    const abort: AbortController = new AbortController()

    const deferral: Deferral<string> = defer<string>(abort.signal)

    const receivedValue: Event = await new Promise<Event>((resolve, reject) => {
      // Reject resolutions, resolve errors.
      deferral.untilResolved().then(reject).catch(resolve)

      abort.abort()
    })

    expect(receivedValue.isTrusted).toEqual(true)
  })
})
