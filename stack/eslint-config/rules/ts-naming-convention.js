"use strict"
module.exports = {
  selector: "interface",
  format: ["PascalCase"],
  custom: {
    regex: "^I[A-Z](?![A-Z])",
    match: false
  }
}
