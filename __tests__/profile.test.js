const request = require("supertest");
const app = require("../index");
const users = require("../src/data/users.json");

describe("GET /api/profile/:userId", () => {
  it("should return 200 with user profile for a valid userId", async () => {
    const validUser = users[0];
    const res = await request(app).get(`/api/profile/${validUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: validUser.id,
      name: validUser.name,
      email: validUser.email,
      avatarUrl: validUser.avatarUrl,
      joinedAt: validUser.joinedAt,
    });
  });

  it("should return 404 with error message for an invalid userId", async () => {
    const res = await request(app).get("/api/profile/nonexistent-user");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("should return response with correct shape", async () => {
    const validUser = users[0];
    const res = await request(app).get(`/api/profile/${validUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("avatarUrl");
    expect(res.body).toHaveProperty("joinedAt");
    expect(typeof res.body.id).toBe("string");
    expect(typeof res.body.name).toBe("string");
    expect(typeof res.body.email).toBe("string");
    expect(typeof res.body.avatarUrl).toBe("string");
    expect(typeof res.body.joinedAt).toBe("string");
  });

  it("should return valid JSON content-type", async () => {
    const validUser = users[0];
    const res = await request(app).get(`/api/profile/${validUser.id}`);

    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
