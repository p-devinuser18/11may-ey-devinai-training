const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const data = fs.readFileSync(
    path.join(__dirname, "../data/products.json"),
    "utf-8",
  );
  const products = JSON.parse(data);
  const { category } = req.query;

  if (category) {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
    return res.json(filtered);
  }

  res.json(products);
});

module.exports = router;
