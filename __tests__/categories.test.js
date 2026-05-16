const request = require("supertest");
const app = require("../index");

describe("GET /api/categories", () => {
  it("should return a list of unique categories", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const unique = [...new Set(res.body)];
    expect(res.body).toEqual(unique);
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return categories sorted alphabetically", async () => {
    const res = await request(app).get("/api/categories");

    const sorted = [...res.body].sort();
    expect(res.body).toEqual(sorted);
  });

  it("should contain expected categories from products data", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.body).toContain("books");
    expect(res.body).toContain("clothing");
    expect(res.body).toContain("electronics");
  });

  it("should return exactly 3 categories", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.body.length).toBe(3);
  });

  it("should return strings only", async () => {
    const res = await request(app).get("/api/categories");

    res.body.forEach((category) => {
      expect(typeof category).toBe("string");
    });
  });
});
