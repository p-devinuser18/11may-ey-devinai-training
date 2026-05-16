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
  const category = req.query.category;
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      )
    : products;
  res.json(filtered);
});

module.exports = router;
