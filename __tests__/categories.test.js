const request = require("supertest");
const app = require("../index");

describe("GET /api/categories", () => {
  it("should return 200 with a JSON array of categories", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return categories sorted alphabetically", async () => {
    const res = await request(app).get("/api/categories");
    const categories = res.body;

    const sorted = [...categories].sort();
    expect(categories).toEqual(sorted);
  });

  it("should return unique category strings with no duplicates", async () => {
    const res = await request(app).get("/api/categories");
    const categories = res.body;

    const unique = [...new Set(categories)];
    expect(categories).toEqual(unique);
    categories.forEach((cat) => {
      expect(typeof cat).toBe("string");
    });
  });

  it("should include expected categories from products data", async () => {
    const res = await request(app).get("/api/categories");
    const categories = res.body;

    expect(categories).toContain("electronics");
    expect(categories).toContain("books");
  });
});
