import { Response } from "@remix-run/node"
import { LoaderFunction } from "@remix-run/server-runtime"
import { readFile } from "node:fs/promises"
import postcss from "postcss"
import tailwindcss from "tailwindcss"

export const defaultInputCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`

export function createLoader(cssFilePath?: string): LoaderFunction {
  let cachedCss: string | undefined

  return async () => {
    if (cachedCss) {
      return cssResponse(cachedCss)
    }

    const inputCss = cssFilePath
      ? await readFile(cssFilePath, "utf-8")
      : defaultInputCss

    const { css } = await postcss(tailwindcss).process(inputCss, {
      from: cssFilePath,
    })

    if (process.env.NODE_ENV === "production") {
      cachedCss = css
    }

    return cssResponse(css)
  }
}

function cssResponse(css: string): Response {
  return new Response(css, {
    headers: { "content-type": "text/css" },
  })
}
