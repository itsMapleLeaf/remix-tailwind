import postcss from "postcss"
import tailwindcss from "tailwindcss"
import { createLoader } from "../src/main"

let currentEnv = process.env.NODE_ENV

defineTests("development")
defineTests("production")

function defineTests(nodeEnv: "development" | "production") {
  beforeEach(() => {
    process.env.NODE_ENV = nodeEnv
  })

  afterEach(() => {
    process.env.NODE_ENV = currentEnv
  })

  test(`serving default css in ${nodeEnv}`, async () => {
    // test multiple times just to be sure
    const loader = createLoader()
    expect(await (await loader({} as any)).text()).toMatchSnapshot()
    expect(await (await loader({} as any)).text()).toMatchSnapshot()
  })

  test(`serving custom css in ${nodeEnv}`, async () => {
    const loader = createLoader("test/fixtures/tailwind.css")
    expect(await (await loader({} as any)).text()).toMatchSnapshot()
    expect(await (await loader({} as any)).text()).toMatchSnapshot()
  })
}

async function processCss(input: string) {
  const { css } = await postcss(tailwindcss).process(input)
  return css
}
