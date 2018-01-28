const express = require("express");
const bodyParser = require("body-parser");
const serverlessHttp = require("serverless-http");

const routes = require("./routes");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded"
  })
);

app.use("/", routes);

module.exports.handler = serverlessHttp(app);
