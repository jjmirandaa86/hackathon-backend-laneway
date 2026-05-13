const { Router } = require("express");
const mysqlMethods = require("../database/mysql.methods");

const router = Router();

const urlApiNinjas =
  process.env.API_NINJAS_URL || "https://api.api-ninjas.com/v1/airquality";
const apiNinjasKey = process.env.API_NINJAS_KEY;

router.post("/api/air-quality", async (req, res) => {
  try {
    const {
      city,
      overall_aqi,
      CO_concentration,
      CO_aqi,
      PM10_concentration,
      PM10_aqi,
      SO2_concentration,
      SO2_aqi,
      PM2_5_concentration,
      O3_concentration,
      O3_aqi,
      NO2_concentration,
      NO2_aqi,
      status,
      risk,
    } = req.body;

    if (!city) {
      return res.status(400).json({
        message: "name are required",
      });
    }

    const airQuality = await mysqlMethods.insertDataAirQuality({
      city,
      overall_aqi,
      CO_concentration,
      CO_aqi,
      PM10_concentration,
      PM10_aqi,
      SO2_concentration,
      SO2_aqi,
      PM2_5_concentration,
      O3_concentration,
      O3_aqi,
      NO2_concentration,
      NO2_aqi,
      status,
      risk,
    });

    res.status(201).json({
      message: "Air Quality saved successfully",
      airQuality,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving Air Quality",
      error: error.message,
    });
  }
});

router.get("/api/air-quality", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "city is required",
      });
    }

    const url = `${urlApiNinjas}?city=${encodeURIComponent(city)}`;
    const response = await fetch(url, {
      headers: {
        "X-Api-Key": apiNinjasKey,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Error getting Air Quality from external API",
        error: data,
      });
    }

    res.json({
      message: "Air Quality external API data",
      city,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error consulting Air Quality external API",
      error: error.message,
    });
  }
});

router.get("/api/air-quality-historical", async (req, res) => {
  try {
    const data = await mysqlMethods.getAllAirQuality();

    res.json({
      message: "Air Quality historical data",
      total: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting Air Quality historical data",
      error: error.message,
    });
  }
});

module.exports = router;
