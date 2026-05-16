const express = require("express");

const router = express.Router();

router.get("/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.WEATHER_API_KEY;

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "City not found" });
      }
      return res.status(502).json({ error: "Weather service unavailable" });
    }

    const data = await response.json();

    return res.status(200).json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
    });
  } catch (err) {
    return res.status(502).json({ error: "Weather service unavailable" });
  }
});

module.exports = router;
