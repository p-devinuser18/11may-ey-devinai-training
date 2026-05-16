const request = require("supertest");
const app = require("../index");
const products = require("../src/data/products.json");

describe("GET /api/products", () => {
  it("should return all products when no category filter is provided", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(products);
    expect(res.body.length).toBe(6);
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/products");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should filter products by category", async () => {
    const res = await request(app).get("/api/products?category=electronics");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should filter by category case-insensitively (uppercase)", async () => {
    const res = await request(app).get("/api/products?category=ELECTRONICS");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should filter by category case-insensitively (mixed case)", async () => {
    const res = await request(app).get("/api/products?category=Books");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("books");
    });
  });

  it("should return empty array for non-existent category", async () => {
    const res = await request(app).get("/api/products?category=toys");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return empty array for invalid category", async () => {
    const res = await request(app).get("/api/products?category=xyz123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return products with correct shape", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    res.body.forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("inStock");
    });
  });
});
