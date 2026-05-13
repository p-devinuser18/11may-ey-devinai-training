const request = require("supertest");
const app = require("../index");
const { version } = require("../package.json");

describe("GET /health", () => {
  it("should return 200 with status, uptime, and version", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("uptime");
    expect(typeof res.body.uptime).toBe("number");
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    expect(res.body).toHaveProperty("version", version);
  });

  it("should return valid JSON content-type", async () => {
    const res = await request(app).get("/health");

    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
