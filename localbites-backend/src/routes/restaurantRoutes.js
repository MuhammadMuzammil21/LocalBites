const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

// GET /api/restaurants/geojson
router.get("/geojson", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    const geoJson = {
      type: "FeatureCollection",
      features: restaurants.map((r) => ({
        type: "Feature",
        geometry: r.location,
        properties: {
          name: r.name,
          description: r.description,
          id: r._id,
        },
      })),
    };
    res.json(geoJson);
  } catch (err) {
    res.status(500).json({ error: "GeoJSON fetch failed" });
  }
});

// GET /api/restaurants/nearby?lng=...&lat=...&radius=...
router.get("/nearby", async (req, res) => {
  const { lng, lat, radius = 5000 } = req.query;
  try {
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      },
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Nearby search failed" });
  }
});

// GET /api/restaurants - Get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
});



module.exports = router;
