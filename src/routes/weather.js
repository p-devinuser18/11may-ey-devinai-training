const express = require("express");

const router = express.Router();

router.get("/:city", async (req, res) => {
  const { city } = req.params;
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }

    if (!response.ok) {
      return res.status(502).json({ error: "Weather service unavailable" });
    }

    const data = await response.json();

    return res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
    });
  } catch (error) {
    return res.status(502).json({ error: "Weather service unavailable" });
  }
});

module.exports = router;
