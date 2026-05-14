const express = require("express");
const healthRouter = require("./src/routes/health");
const profileRouter = require("./src/routes/profile");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/health", healthRouter);
app.use("/api/profile", profileRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
