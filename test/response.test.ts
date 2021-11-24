import { serveTailwindCss } from "../src/main"

const currentEnv = process.env.NODE_ENV

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
    expect(await (await serveTailwindCss()).text()).toMatchSnapshot()
    expect(await (await serveTailwindCss()).text()).toMatchSnapshot()
  })

  test(`serving custom css in ${nodeEnv}`, async () => {
    expect(
      await (await serveTailwindCss("test/fixtures/tailwind.css")).text(),
    ).toMatchSnapshot()
    expect(
      await (await serveTailwindCss("test/fixtures/tailwind.css")).text(),
    ).toMatchSnapshot()
  })
}
