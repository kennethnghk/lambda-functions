const express = require("express");
const routes = require("./routes");
const serverlessHttp = require("serverless-http");

const app = new express();

app.use("/", routes);

module.exports.handle = serverlessHttp(app);
