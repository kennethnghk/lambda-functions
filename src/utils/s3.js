const formatS3Url = key =>
  "https://s3.amazonaws.com/" + process.env.BUCKET + "/" + key;

module.exports = {
  formatS3Url
};
