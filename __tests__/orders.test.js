const request = require("supertest");
const app = require("../index");
const orders = require("../src/data/orders.json");

describe("GET /api/orders", () => {
  it("should return 200 with a JSON array of orders", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(5);
  });

  it("should return orders with the correct properties", async () => {
    const res = await request(app).get("/api/orders");

    res.body.forEach((order) => {
      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("productId");
      expect(order).toHaveProperty("quantity");
      expect(order).toHaveProperty("totalPrice");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("createdAt");
    });
  });

  it("should only contain valid status values", async () => {
    const res = await request(app).get("/api/orders");
    const validStatuses = ["pending", "shipped", "delivered"];

    res.body.forEach((order) => {
      expect(validStatuses).toContain(order.status);
    });
  });

  it("should return the correct order data", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.body).toEqual(orders);
  });
});
