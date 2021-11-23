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
