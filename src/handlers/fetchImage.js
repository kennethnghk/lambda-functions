"use strict";

const path = require("path");
const fetch = require("node-fetch");
const format = require("date-fns/format");

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const s3 = new AWS.S3();

const log = require("../utils/logger");
const { formatS3Url } = require("../utils/s3");

const getS3Key = imageUrl =>
  format(new Date(), "YYYYMMDD/HHmmss") + path.extname(imageUrl);

module.exports = (req, res) => {
  const { imageUrl } = req.body;

  log.info("fetchUrl=[" + imageUrl + "]");
  if (!imageUrl) {
    res.status(400).send({ error: "Invaild image URL" });
  }

  const s3Key = getS3Key(imageUrl);

  // https://github.com/serverless/examples/tree/master/aws-node-fetch-file-and-store-in-s3
  fetch(imageUrl)
    .then(response => {
      if (response.ok) {
        return response;
      }

      log.error(
        `Failed to fetch ${response.url}: ${response.status} ${
          response.statusText
        }`
      );
      res.status(400).send({ error: "Image fetch failed" });
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
    .then(
      () => {
        res.send({ imageUrl, s3Url: formatS3Url(s3Key) });
      },
      () => {
        log.error("Image upload failed");
        res.status(400).send({ error: "Image upload failed" });
      }
    );
};
