const express = require("express");
const orders = require("../data/orders.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(orders);
});

module.exports = router;
