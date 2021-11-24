/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  // transform typescript files with esbuild-jest
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
}
