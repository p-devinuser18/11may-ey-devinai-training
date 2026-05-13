const request = require("supertest");
const app = require("../index");
const users = require("../src/data/users.json");

describe("GET /api/profile/:userId", () => {
  it("should return 200 with user profile for a valid userId", async () => {
    const res = await request(app).get("/api/profile/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", users["1"].name);
    expect(res.body).toHaveProperty("email", users["1"].email);
    expect(res.body).toHaveProperty("avatarUrl", users["1"].avatarUrl);
    expect(res.body).toHaveProperty("joinDate", users["1"].joinDate);
  });

  it("should return 404 for a non-existent userId", async () => {
    const res = await request(app).get("/api/profile/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });

  it("should return valid JSON content-type", async () => {
    const res = await request(app).get("/api/profile/1");

    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
