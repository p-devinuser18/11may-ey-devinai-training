const express = require("express");
const orders = require("../data/orders.json");

const router = express.Router();

router.get("/", (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  let filtered = orders;

  if (req.query.status) {
    filtered = filtered.filter(
      (order) => order.status === req.query.status.toLowerCase(),
    );
  }

  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  res.json(paginated);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

module.exports = router;
