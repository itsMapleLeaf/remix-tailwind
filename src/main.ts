import { Response } from "@remix-run/node"
import { readFile } from "fs/promises"
import postcss from "postcss"
import tailwindcss from "tailwindcss"

export const defaultInputCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`

let cachedCss: string | undefined

export async function serveTailwindCss(cssFilePath?: string) {
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

function cssResponse(css: string): Response {
  return new Response(css, {
    headers: { "content-type": "text/css" },
  })
}
