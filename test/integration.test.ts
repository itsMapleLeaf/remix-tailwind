import { fetch } from "@remix-run/node"
import type { ExecaChildProcess } from "execa"
import { execa } from "execa"
import { setTimeout } from "node:timers/promises"

beforeAll(async () => {
  await execa("pnpm", ["build"])
}, 10_000)

let child: ExecaChildProcess | undefined
afterEach(() => {
  child?.cancel()
})

test("integration", async () => {
  // dev
  child = execa("pnpm", ["dev"], {
    cwd: "test/fixtures/remix-app",
    stdio: "inherit",
  })

  await assertResponses()
  await cancelPromise(child)

  // prod
  await execa("pnpm", ["build"], {
    cwd: "test/fixtures/remix-app",
    stdio: "inherit",
  })

  child = execa("pnpm", ["start"], {
    cwd: "test/fixtures/remix-app",
    stdio: "inherit",
  })

  await assertResponses()
}, 20_000)

async function assertResponses() {
  await waitForResponse("/")

  {
    const response = await waitForResponse("/tailwindcss-default")
    expect(response.headers.get("content-type")).toContain("text/css")
    expect(await response.text()).toMatchSnapshot()
  }

  {
    const response = await waitForResponse("/tailwindcss-custom")
    expect(response.headers.get("content-type")).toContain("text/css")
    expect(await response.text()).toMatchSnapshot()
  }
}

async function waitForResponse(path: string) {
  const startTime = Date.now()
  let error: Error | undefined

  while (error == undefined) {
    try {
      const url = new URL(`http://localhost:3000`)
      url.pathname = path

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(
          `Response failed: ${response.status} ${response.statusText}`,
        )
      }
      return response
      // eslint-disable-next-line unicorn/catch-error-name
    } catch (caught) {
      if (Date.now() - startTime > 20_000) {
        error = caught instanceof Error ? caught : new Error(String(caught))
      }
    }
    await setTimeout(100)
  }

  throw error
}

function cancelPromise(child: ExecaChildProcess) {
  return new Promise<void>((resolve) => {
    if (child.killed) {
      resolve()
    } else {
      void child.once("exit", resolve)
      child.kill(undefined, { forceKillAfterTimeout: 1000 })
    }
  })
}
