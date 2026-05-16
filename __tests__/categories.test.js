const request = require("supertest");
const app = require("../index");

describe("GET /api/categories", () => {
  it("should return 200 with an array of categories", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return categories sorted alphabetically", async () => {
    const res = await request(app).get("/api/categories");

    const sorted = [...res.body].sort();
    expect(res.body).toEqual(sorted);
  });

  it("should return unique categories with no duplicates", async () => {
    const res = await request(app).get("/api/categories");

    const unique = [...new Set(res.body)];
    expect(res.body).toEqual(unique);
  });

  it("should return valid JSON content-type", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should contain expected category strings", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.body).toContain("electronics");
    expect(res.body).toContain("books");
  });
});
