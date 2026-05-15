const express = require("express");
const products = require("../data/products.json");

const router = express.Router();

router.get("/", (req, res) => {
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
