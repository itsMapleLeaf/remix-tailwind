import { fetch } from "@remix-run/node"
import type { ExecaChildProcess } from "execa"
import { execa } from "execa"
import { setTimeout } from "timers/promises"

beforeAll(async () => {
  await execa("pnpm", ["build"])
})

let child: ExecaChildProcess | undefined
afterEach(() => {
  child?.kill()
})

test("dev", async () => {
  child = execa("pnpm", ["dev"], {
    cwd: "test/fixtures/remix-app",
  })
  await assertResponses()
}, 20000)

test("prod", async () => {
  await execa("pnpm", ["build"], {
    cwd: "test/fixtures/remix-app",
  })

  child = execa("pnpm", ["start"], {
    cwd: "test/fixtures/remix-app",
  })

  await assertResponses()
}, 20000)

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

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Response failed: ${res.status} ${res.statusText}`)
      }
      return res
    } catch (caught) {
      if (Date.now() - startTime > 10000) {
        error = caught instanceof Error ? caught : new Error(String(caught))
      }
    }
    await setTimeout(100)
  }

  throw error
}
