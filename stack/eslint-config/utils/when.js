"use strict"
require("dotenv-defaults/config")

module.exports = (env) => (process.env.NODE_ENV === env ? "error" : "off")
