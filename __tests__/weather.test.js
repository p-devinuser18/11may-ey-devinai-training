const request = require("supertest");
const app = require("../index");

const mockWeatherData = {
  name: "London",
  main: { temp: 15.5, humidity: 72 },
  weather: [{ description: "scattered clouds" }],
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("GET /api/weather/:city", () => {
  it("should return weather data for a valid city", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockWeatherData,
    });

    const res = await request(app).get("/api/weather/London");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      city: "London",
      temperature: 15.5,
      description: "scattered clouds",
      humidity: 72,
    });
  });

  it("should return JSON content type", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockWeatherData,
    });

    const res = await request(app).get("/api/weather/London");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return 404 when city is not found", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const res = await request(app).get("/api/weather/InvalidCity123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "City not found" });
  });

  it("should return 502 when the weather API returns a server error", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const res = await request(app).get("/api/weather/London");

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });

  it("should return 502 when the request times out", async () => {
    const timeoutError = new DOMException("signal timed out", "TimeoutError");
    global.fetch.mockRejectedValue(timeoutError);

    const res = await request(app).get("/api/weather/London");

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });

  it("should return 502 when fetch throws a network error", async () => {
    global.fetch.mockRejectedValue(new Error("fetch failed"));

    const res = await request(app).get("/api/weather/London");

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });

  it("should call the OpenWeatherMap API with correct URL", async () => {
    process.env.WEATHER_API_KEY = "test-api-key";

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockWeatherData,
    });

    await request(app).get("/api/weather/London");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/weather?q=London&appid=test-api-key&units=metric",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    delete process.env.WEATHER_API_KEY;
  });
});
