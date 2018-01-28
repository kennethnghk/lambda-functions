"use strict";

const qs = require("qs");
const path = require("path");
const format = require("date-fns/format");

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const s3 = new AWS.S3();

const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "serverless-services" });

const getUploadImagePath = imageUrl =>
  format(new Date(), "YYYYMMDD/HHmmss") + path.extname(imageUrl);

module.exports.fetchImage = (event, context, callback) => {
  const { imageUrl } = qs.parse(event.body);
  log.info("fetchUrl=[" + imageUrl + "]");

  const uploadImagePath = getUploadImagePath(imageUrl);

  // https://github.com/serverless/examples/tree/master/aws-node-fetch-file-and-store-in-s3
  fetch(imageUrl)
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
    .then(buffer =>
      s3
        .putObject({
          Bucket: process.env.BUCKET,
          Key: uploadImagePath,
          Body: buffer,
          ACL: "public-read",
          ContentType: "image/jpeg"
        })
        .promise()
    )
    .then(v => {
      console.log(v);
      const response = {
        statusCode: 200,
        body: { imageUrl }
      };
      callback(null, response);
    });
};
