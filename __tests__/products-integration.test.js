const request = require("supertest");
const app = require("../index");

describe("GET /api/products - integration tests", () => {
  it("should return 200 with all products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(6);
  });

  it("should return only electronics when filtered by category=electronics", async () => {
    const res = await request(app).get("/api/products?category=electronics");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should filter case-insensitively (category=ELECTRONICS)", async () => {
    const lower = await request(app).get("/api/products?category=electronics");
    const upper = await request(app).get("/api/products?category=ELECTRONICS");

    expect(upper.statusCode).toBe(200);
    expect(upper.body).toEqual(lower.body);
  });

  it("should return 200 with empty array for nonexistent category", async () => {
    const res = await request(app).get("/api/products?category=nonexistent");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return products with correct shape { id, name, price, category, inStock }", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    res.body.forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("inStock");
    });
  });

  it("should have price > 0 for all products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    res.body.forEach((product) => {
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it("should return application/json content type", async () => {
    const res = await request(app).get("/api/products");

    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
