const request = require("supertest");
const app = require("../index");

beforeEach(() => {
  process.env.WEATHER_API_KEY = "test-api-key";
  jest.restoreAllMocks();
});

describe("GET /api/weather/:city", () => {
  it("should return 200 with weather data for a valid city", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        name: "London",
        main: { temp: 15.2, humidity: 72 },
        weather: [{ description: "scattered clouds" }],
      }),
    });

    const res = await request(app).get("/api/weather/London");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      city: "London",
      temperature: 15.2,
      description: "scattered clouds",
      humidity: 72,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=London"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("should return 404 when city is not found", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const res = await request(app).get("/api/weather/InvalidCity123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "City not found" });
  });

  it("should return 502 when the weather API returns a server error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const res = await request(app).get("/api/weather/London");

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });

  it("should return 502 when the request times out", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(
        new DOMException("The operation was aborted.", "AbortError"),
      );

    const res = await request(app).get("/api/weather/London");

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });
});
