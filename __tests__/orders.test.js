const request = require("supertest");
const app = require("../index");
const orders = require("../src/data/orders.json");

describe("GET /api/orders", () => {
  it("should return all orders when no filters are provided", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(orders);
    expect(res.body.length).toBe(5);
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return orders with correct shape", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.statusCode).toBe(200);
    res.body.forEach((order) => {
      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("productId");
      expect(order).toHaveProperty("quantity");
      expect(order).toHaveProperty("totalPrice");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("createdAt");
    });
  });

  it("should have valid status values for all orders", async () => {
    const res = await request(app).get("/api/orders");
    const validStatuses = ["pending", "shipped", "delivered"];

    expect(res.statusCode).toBe(200);
    res.body.forEach((order) => {
      expect(validStatuses).toContain(order.status);
    });
  });
});

describe("GET /api/orders - status filtering", () => {
  it("should filter orders by status=pending", async () => {
    const res = await request(app).get("/api/orders?status=pending");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((order) => {
      expect(order.status).toBe("pending");
    });
  });

  it("should filter orders by status=shipped", async () => {
    const res = await request(app).get("/api/orders?status=shipped");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((order) => {
      expect(order.status).toBe("shipped");
    });
  });

  it("should filter orders by status=delivered", async () => {
    const res = await request(app).get("/api/orders?status=delivered");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((order) => {
      expect(order.status).toBe("delivered");
    });
  });

  it("should filter status case-insensitively", async () => {
    const lower = await request(app).get("/api/orders?status=pending");
    const upper = await request(app).get("/api/orders?status=PENDING");

    expect(upper.statusCode).toBe(200);
    expect(upper.body).toEqual(lower.body);
  });

  it("should return empty array for non-existent status", async () => {
    const res = await request(app).get("/api/orders?status=cancelled");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/orders - pagination", () => {
  it("should return all orders with default pagination", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(5);
  });

  it("should limit results with limit parameter", async () => {
    const res = await request(app).get("/api/orders?limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(orders[0].id);
    expect(res.body[1].id).toBe(orders[1].id);
  });

  it("should return second page of results", async () => {
    const res = await request(app).get("/api/orders?page=2&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(orders[2].id);
    expect(res.body[1].id).toBe(orders[3].id);
  });

  it("should return last partial page", async () => {
    const res = await request(app).get("/api/orders?page=3&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(orders[4].id);
  });

  it("should return empty array when page exceeds total pages", async () => {
    const res = await request(app).get("/api/orders?page=10&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should default to page 1 when page is not provided", async () => {
    const res = await request(app).get("/api/orders?limit=3");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].id).toBe(orders[0].id);
  });

  it("should combine status filter with pagination", async () => {
    const res = await request(app).get(
      "/api/orders?status=delivered&page=1&limit=1",
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe("delivered");
  });
});

describe("GET /api/orders/:id", () => {
  it("should return a single order by id", async () => {
    const res = await request(app).get("/api/orders/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(orders[0]);
    expect(res.body.id).toBe("1");
  });

  it("should return 404 for non-existent order id", async () => {
    const res = await request(app).get("/api/orders/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for non-matching order id", async () => {
    const res = await request(app).get("/api/orders/abc");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return order with correct shape", async () => {
    const res = await request(app).get("/api/orders/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("productId");
    expect(res.body).toHaveProperty("quantity");
    expect(res.body).toHaveProperty("totalPrice");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/orders/1");

    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
