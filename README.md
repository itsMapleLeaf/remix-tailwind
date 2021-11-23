# remix-tailwind

Use [TailwindCSS](https://tailwindcss.com) with [Remix](https://remix.run) without an extra build step!

## Install

```sh
# npm
npm install remix-tailwind tailwindcss postcss

# pnpm
pnpm install remix-tailwind tailwindcss postcss

# yarn
yarn add remix-tailwind tailwindcss postcss
```

## Usage

Generate a tailwind config:

```sh
npx tailwindcss init
```

Create a file at `app/routes/tailwindcss.tsx` or `app/routes/tailwindcss.js`:

```ts
import { createLoader } from "remix-tailwind"
export const loader = createLoader()
```

Add a link to this route in `app/root.tsx`:

```js
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwindcss" }]
}
```

And that's it! Get styling. 🖌

## Custom CSS file

remix-tailwind uses a default CSS file, but you can provide a path to your own. The path can be absolute, or relative to the current working directory.

```ts
// app/routes/tailwindcss.tsx
import { createLoader } from "remix-tailwind"
export const loader = createLoader("app/tailwind.css")
```

```css
/* app/tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  @apply bg-slate-900 text-slate-100;
}
```

## How it works

In development:

- Reads your tailwind CSS file (if provided) and config when requesting the route
- Returns the CSS from the route, same as if you imported it

In production:

- Reads the tailwind CSS file and config
- Caches the output CSS and returns that on each request (but HTTP caching should do most of the work anyway 😜)
