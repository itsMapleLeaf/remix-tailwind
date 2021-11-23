import type { LoaderFunction } from "@remix-run/server-runtime"
import { readFile, stat } from "fs/promises"
import { dirname, join, parse } from "path"
import postcss from "postcss"
import tailwindcss from "tailwindcss"

const defaultInputCss = `
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

    const config = await loadTailwindConfig()

    const { css } = await postcss(tailwindcss(config)).process(inputCss, {
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

async function findTailwindConfigPath() {
  let currentFolder = process.cwd()
  let searchedPaths: string[] = []

  do {
    const configPath = join(currentFolder, "tailwind.config.js")
    if (await exists(configPath)) {
      return configPath
    }
    searchedPaths.push(configPath)
    currentFolder = dirname(currentFolder)
  } while (parse(currentFolder).root !== currentFolder)

  const searchedPathsOutput = searchedPaths.map((dir) => `\t${dir}`).join("\n")
  const errorMessage = `Could not find tailwind.config.js. Searched these paths:\n${searchedPathsOutput}`
  throw new Error(errorMessage)
}

async function loadTailwindConfig() {
  const configPath = await findTailwindConfigPath()
  const configModule = await import(configPath)
  const config = configModule.default || configModule

  if (!config) {
    throw new Error(
      `Config at ${configPath} is invalid. Did you export the config?`,
    )
  }
  return config
}

async function exists(path: string) {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch (error) {
    return false
  }
}
