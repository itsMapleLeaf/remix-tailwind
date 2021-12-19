/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  // transform typescript files with esbuild-jest
  transform: {
    "^.+\\.tsx?$": ["esbuild-jest", { format: "esm" }],
  },

  // treat ts as es modules
  extensionsToTreatAsEsm: [".ts"],

  // ignore fixtures in watch mode
  watchPathIgnorePatterns: [
    "<rootDir>/test/fixtures/.*",
    "<rootDir>/test/__snapshots__/.*",
  ],
}
// eslint-disable-next-line import/no-unused-modules
export default config
