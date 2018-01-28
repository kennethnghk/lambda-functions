const express = require("express");
const router = express.Router();

const fetchImage = require("../handlers/fetchImage");

router.post("/image/fetch", fetchImage);

module.exports = router;
