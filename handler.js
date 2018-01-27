"use strict";

const qs = require("qs");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "serverless-services" });

module.exports.fetchImage = (event, context, callback) => {
  const { url } = qs.parse(event.body);

  log.info("fetch url: " + url);

  // https://github.com/serverless/examples/tree/master/aws-node-fetch-file-and-store-in-s3
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(
        new Error(
          `Failed to fetch ${response.url}: ${response.status} ${
            response.statusText
          }`
        )
      );
    })
    .then(response => response.buffer())
    .then(buffer => console.log(buffer))
    .then(() => {
      const response = {
        statusCode: 200,
        body: { url }
      };
      callback(null, response);
    });
};
