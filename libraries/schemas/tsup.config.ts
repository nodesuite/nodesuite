import { defineConfig } from "tsup"

export default defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  keepNames: true,
  minify: true,
  minifyWhitespace: false,
  outDir: "dist",
  platform: "node",
  sourcemap: true,
  splitting: false,
  target: "node16",
  treeshake: "recommended"
})
