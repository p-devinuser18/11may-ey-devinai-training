const express = require("express");
const { version } = require("../../package.json");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/", (req, res) => {
  const response = {
    status: "ok",
    uptime: process.uptime(),
    version,
  };
  res.json(response);
  logger.info("Request handled", {
    method: req.method,
    path: req.originalUrl,
    statusCode: res.statusCode,
  });
});

module.exports = router;
