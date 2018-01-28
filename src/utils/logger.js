const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "serverless-services" });

module.exports = log;
