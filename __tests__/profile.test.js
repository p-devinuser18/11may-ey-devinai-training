const request = require("supertest");
const app = require("../index");
const users = require("../src/data/users.json");

describe("GET /api/profile/:userId", () => {
  it("should return 200 with profile data for a valid user", async () => {
    const res = await request(app).get("/api/profile/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", users[0].name);
    expect(res.body).toHaveProperty("email", users[0].email);
    expect(res.body).toHaveProperty("avatar", users[0].avatar);
    expect(res.body).toHaveProperty("joinDate", users[0].joinDate);
  });

  it("should return valid JSON content-type", async () => {
    const res = await request(app).get("/api/profile/1");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return 404 for a non-existent user ID", async () => {
    const res = await request(app).get("/api/profile/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });

  it("should return 404 for a non-numeric user ID", async () => {
    const res = await request(app).get("/api/profile/abc");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });

  it("should not include the user ID in the response body", async () => {
    const res = await request(app).get("/api/profile/1");

    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty("id");
  });
});
