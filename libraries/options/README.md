<img alt="nodesuite" src="https://user-images.githubusercontent.com/65471523/183563697-5401a9f6-efec-4cf3-a907-9ad66721659f.png" height="32" />

# @nodesuite/options

Universal options parser for cli argument, environment variables, and configuration files.


## Reference

Options key resolution and precedence follows the [AWS Configuration Variables](https://docs.aws.amazon.com/cli/latest/topic/config-vars.html#precedence) style guide:

https://docs.aws.amazon.com/cli/latest/topic/config-vars.html


## Format & Priority

### 1. CLI arguments
- `--param-case` keys.
- Must set the property using a `=` value with zero whitespace.

### 2. Environment variables
- `CONSTANT_CASE` keys.
- Will search recursively for any `.env` or `.env.defaults` files.

### 3. Configuration file
- `camelCase` keys.
- JSON file format. _(YAML coming soon)_