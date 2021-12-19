// remix can't handle node: imports yet
/* eslint-disable unicorn/prefer-node-protocol */
import { Response } from "@remix-run/node"
import { readFile } from "fs/promises"
import path from "path"
import postcss from "postcss"
import tailwindcss from "tailwindcss"

const defaultInputCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`

const cache = new Map<string | symbol, string>()
const defaultCacheKey = Symbol("remix-tailwind-default")

export async function serveTailwindCss(cssFilePath?: string) {
  const cacheKey = cssFilePath ? toAbsolutePath(cssFilePath) : defaultCacheKey
  const cachedResponse = cache.get(cacheKey)
  if (process.env.NODE_ENV === "production" && cachedResponse) {
    return cssResponse(cachedResponse)
  }

  const inputCss = cssFilePath
    ? await readFile(cssFilePath, "utf-8")
    : defaultInputCss

  const { css } = await postcss(tailwindcss).process(inputCss, {
    from: cssFilePath,
  })

  if (process.env.NODE_ENV === "production") {
    cache.set(cacheKey, css)
  }

  return cssResponse(css)
}

function cssResponse(css: string): Response {
  return new Response(css, {
    headers: { "content-type": "text/css" },
  })
}

function toAbsolutePath(inputPath: string): string {
  if (path.isAbsolute(inputPath)) {
    return inputPath
  }
  return path.join(process.cwd(), inputPath)
}

/**
 * @deprecated The createLoader api has potential pitfalls and is not recommended. Use `serveTailwindCss` instead:
 * ```ts
 * import type { LoaderFunction } from "remix"
 * import { serveTailwindCss } from "remix-tailwind"
 *
 * export const loader: LoaderFunction = () => serveTailwindCss()
 * ```
 */
// eslint-disable-next-line import/no-unused-modules
export function createLoader(cssFilePath?: string) {
  return () => serveTailwindCss(cssFilePath)
}
