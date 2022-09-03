module.exports = {
  entry: ["src/index.ts"],
  outDir: "dist",
  splitting: false,
  sourcemap: "inline",
  clean: true,
  dts: true,
  treeshake: true,
  format: ["cjs", "esm"],
  target: "node16",
  minify: true,
  platform: "node"
}
