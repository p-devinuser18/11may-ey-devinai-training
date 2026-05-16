const express = require("express");
const logger = require("./src/utils/logger");
const healthRouter = require("./src/routes/health");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
  logger.info("Request handled", {
    method: req.method,
    path: req.originalUrl,
    statusCode: res.statusCode,
  });
});

app.use("/health", healthRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
