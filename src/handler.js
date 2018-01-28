"use strict";

const qs = require("qs");
const path = require("path");
const fetch = require("node-fetch");
const format = require("date-fns/format");

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const s3 = new AWS.S3();

const log = require("./utils/logger");
const { formatS3Url } = require("./utils/s3");

const getS3Key = imageUrl =>
  format(new Date(), "YYYYMMDD/HHmmss") + path.extname(imageUrl);

module.exports.fetchImage = (event, context, callback) => {
  const { imageUrl } = qs.parse(event.body);
  log.info("fetchUrl=[" + imageUrl + "]");

  const s3Key = getS3Key(imageUrl);

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
          Key: s3Key,
          Body: buffer,
          ACL: "public-read",
          ContentType: "image/jpeg"
        })
        .promise()
    )
    .then(() => {
      const response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({ imageUrl, s3Url: formatS3Url(s3Key) })
      };
      callback(null, response);
    }, callback);
};
