module.exports = {
  files: ["test/*.test.ts"],
  concurrency: 5,
  failFast: true,
  cache: true,
  extensions: ["ts"],
  failWithoutAssertions: false,
  environmentVariables: {
    NODE_ENV: "test"
  },
  verbose: true,
  require: ["jiti/register", "dotenv-defaults/config"],
  nodeArguments: ["--trace-deprecation", "--napi-modules"]
}
