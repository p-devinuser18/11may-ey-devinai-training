const request = require("supertest");
const app = require("../index");
const products = require("../src/data/products.json");

describe("GET /api/products", () => {
  it("should return 200 with all products when no category filter", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(products.length);
  });

  it("should return products with correct fields", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    const product = res.body[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("category");
    expect(product).toHaveProperty("inStock");
    expect(typeof product.inStock).toBe("boolean");
  });

  it("should return valid JSON content-type", async () => {
    const res = await request(app).get("/api/products");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should filter products by category", async () => {
    const res = await request(app).get("/api/products?category=electronics");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should filter by category case-insensitively", async () => {
    const res = await request(app).get("/api/products?category=Electronics");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should return an empty array for a non-existent category", async () => {
    const res = await request(app).get("/api/products?category=toys");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });
});
