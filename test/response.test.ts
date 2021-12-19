/* eslint-disable unicorn/no-await-expression-member */
import { serveTailwindCss } from "../src/main"

const currentEnvironment = process.env.NODE_ENV

defineTests("development")
defineTests("production")

function defineTests(nodeEnvironment: "development" | "production") {
  beforeEach(() => {
    process.env.NODE_ENV = nodeEnvironment
  })

  afterEach(() => {
    process.env.NODE_ENV = currentEnvironment
  })

  test(`serving default css in ${nodeEnvironment}`, async () => {
    // test multiple times just to be sure
    expect(await (await serveTailwindCss()).text()).toMatchSnapshot()
    expect(await (await serveTailwindCss()).text()).toMatchSnapshot()
  })

  test(`serving custom css in ${nodeEnvironment}`, async () => {
    expect(
      await (await serveTailwindCss("test/fixtures/tailwind.css")).text(),
    ).toMatchSnapshot()
    expect(
      await (await serveTailwindCss("test/fixtures/tailwind.css")).text(),
    ).toMatchSnapshot()
  })
}
