const request = require("supertest");
const app = require("../index");

describe("GET /api/products", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(6);
    res.body.forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(typeof product.id).toBe("string");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("inStock");
    });
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
    const res = await request(app).get("/api/products?category=ELECTRONICS");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should return empty array for non-matching category", async () => {
    const res = await request(app).get("/api/products?category=nonexistent");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should return valid JSON content-type", async () => {
    const res = await request(app).get("/api/products");

    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
