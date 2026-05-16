const request = require("supertest");
const app = require("../index");
const orders = require("../src/data/orders.json");

describe("GET /api/orders", () => {
  it("should return 200 with all orders", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(orders.length);
  });

  it("should return orders with correct shape", async () => {
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

  describe("pagination", () => {
    it("should return first page with default limit of 10", async () => {
      const res = await request(app).get("/api/orders?page=1");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(orders.length);
    });

    it("should respect custom limit", async () => {
      const res = await request(app).get("/api/orders?page=1&limit=2");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(orders[0].id);
      expect(res.body[1].id).toBe(orders[1].id);
    });

    it("should return second page", async () => {
      const res = await request(app).get("/api/orders?page=2&limit=2");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(orders[2].id);
      expect(res.body[1].id).toBe(orders[3].id);
    });

    it("should return empty array for page beyond data", async () => {
      const res = await request(app).get("/api/orders?page=100&limit=10");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it("should return remaining items on last partial page", async () => {
      const res = await request(app).get("/api/orders?page=3&limit=2");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(orders[4].id);
    });
  });

  describe("status filtering", () => {
    it("should filter orders by status=pending", async () => {
      const res = await request(app).get("/api/orders?status=pending");

      expect(res.status).toBe(200);
      res.body.forEach((order) => {
        expect(order.status).toBe("pending");
      });
      expect(res.body).toHaveLength(
        orders.filter((o) => o.status === "pending").length,
      );
    });

    it("should filter orders by status=shipped", async () => {
      const res = await request(app).get("/api/orders?status=shipped");

      expect(res.status).toBe(200);
      res.body.forEach((order) => {
        expect(order.status).toBe("shipped");
      });
      expect(res.body).toHaveLength(
        orders.filter((o) => o.status === "shipped").length,
      );
    });

    it("should filter orders by status=delivered", async () => {
      const res = await request(app).get("/api/orders?status=delivered");

      expect(res.status).toBe(200);
      res.body.forEach((order) => {
        expect(order.status).toBe("delivered");
      });
      expect(res.body).toHaveLength(
        orders.filter((o) => o.status === "delivered").length,
      );
    });

    it("should return empty array for non-existent status", async () => {
      const res = await request(app).get("/api/orders?status=cancelled");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it("should combine status filter with pagination", async () => {
      const res = await request(app).get(
        "/api/orders?status=pending&page=1&limit=1",
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].status).toBe("pending");
    });
  });
});

describe("GET /api/orders/:id", () => {
  it("should return a single order by id", async () => {
    const res = await request(app).get("/api/orders/1");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("productId");
    expect(res.body).toHaveProperty("quantity");
    expect(res.body).toHaveProperty("totalPrice");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("should return 404 for non-existent order", async () => {
    const res = await request(app).get("/api/orders/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Order not found");
  });

  it("should return 404 for invalid id", async () => {
    const res = await request(app).get("/api/orders/abc");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Order not found");
  });
});
