const express = require("express");
const products = require("../data/products.json");

const router = express.Router();

router.get("/", (req, res) => {
  const category = req.query.category;
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      )
    : products;
  res.json(filtered);
});

module.exports = router;
