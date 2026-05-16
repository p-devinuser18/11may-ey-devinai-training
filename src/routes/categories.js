const express = require("express");
const products = require("../data/products.json");

const router = express.Router();

router.get("/", (req, res) => {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  res.json(categories);
});

module.exports = router;
