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

1. Generate a tailwind config:

   ```sh
   npx tailwindcss init
   ```

1. Create a file at `app/routes/tailwindcss.tsx` or `app/routes/tailwindcss.js`:

   ```ts
   import type { LoaderFunction } from "remix"
   import { serveTailwindCss } from "remix-tailwind"

   export const loader: LoaderFunction = () => serveTailwindCss()
   ```

1. Add a link to this route in `app/root.tsx`:

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
import type { LoaderFunction } from "remix"
import { serveTailwindCss } from "remix-tailwind"

export const loader: LoaderFunction = () => serveTailwindCss("app/tailwind.css")
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

- Reads your CSS and config when requesting the route
- Processes tailwind CSS via PostCSS and returns it as a response
- Remix takes that CSS and applies it to the page (via a link tag, that ol' thing)

In production, the CSS is only built once, and cached on every following request. This is _probably_ fine, but you could consider prebuilding the CSS yourself if you like.
