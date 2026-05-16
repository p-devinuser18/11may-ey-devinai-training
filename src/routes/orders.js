const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const data = fs.readFileSync(
    path.join(__dirname, "../data/orders.json"),
    "utf-8",
  );
  let orders = JSON.parse(data);

  const { status, page, limit } = req.query;

  if (status) {
    orders = orders.filter(
      (o) => o.status.toLowerCase() === status.toLowerCase(),
    );
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedOrders = orders.slice(startIndex, startIndex + limitNum);

  res.json(paginatedOrders);
});

router.get("/:id", (req, res) => {
  const data = fs.readFileSync(
    path.join(__dirname, "../data/orders.json"),
    "utf-8",
  );
  const orders = JSON.parse(data);
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

module.exports = router;
